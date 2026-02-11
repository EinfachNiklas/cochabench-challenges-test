# Concurrent Web Crawler (Go)

## Aufgabe

Implementiere einen vollständigen, concurrent Web Crawler in Go, der Webseiten parallel crawlt, Links extrahiert und verschiedene Constraints beachtet.

## Kontext

Web Crawler sind Programme, die systematisch Webseiten besuchen und Informationen sammeln. Diese Challenge kombiniert mehrere wichtige Go-Konzepte:

- **Concurrency**: Goroutines, Channels, WaitGroups
- **Context**: Timeout und Cancellation
- **HTTP**: Client-Requests, Response-Handling
- **HTML Parsing**: Link- und Title-Extraktion
- **Synchronisation**: Thread-safe Datenstrukturen

## Anforderungen

### Strukturen

```go
type CrawlResult struct {
    URL          string
    Title        string
    Links        []string
    StatusCode   int
    ResponseTime time.Duration
    Error        error
    Depth        int
}

type CrawlerConfig struct {
    MaxDepth       int
    MaxConcurrent  int
    Timeout        time.Duration
    MaxPages       int
    RateLimitDelay time.Duration
    UserAgent      string
    FollowExternal bool
}

type Crawler struct {
    config CrawlerConfig
    // ... interne Felder
}
```

### Funktionen

#### `NewCrawler(config CrawlerConfig) (*Crawler, error)`
Erstellt einen neuen Crawler mit Validierung:
- `MaxDepth >= 0`
- `MaxConcurrent > 0`
- `Timeout > 0`
- `MaxPages >= 0` (0 = unbegrenzt)

#### `Crawl(ctx context.Context, startURL string) ([]CrawlResult, error)`
**Haupt-Crawl-Funktion** mit folgenden Features:

1. **Concurrent Crawling**
   - Verwendet Worker-Pool mit `MaxConcurrent` Goroutines
   - Channel-basierte Work-Queue
   - Parallele HTTP-Requests

2. **Duplikat-Vermeidung**
   - Jede URL wird maximal einmal gecrawlt
   - Thread-safe visited-Map (sync.Map oder Mutex)
   - URL-Normalisierung vor Duplikat-Check

3. **Tiefenbegrenzung**
   - Start-URL hat Depth 0
   - Gefundene Links haben Depth = Parent-Depth + 1
   - Stoppt bei `MaxDepth`

4. **Seiten-Limit**
   - Stoppt nach `MaxPages` gecrawlten Seiten
   - 0 = unbegrenzt

5. **Rate Limiting**
   - `RateLimitDelay` zwischen Requests zur selben Domain
   - Pro-Domain Tracking mit Timestamps

6. **Context-Unterstützung**
   - Respektiert Context-Cancellation
   - Stoppt gracefully bei Timeout/Cancel

7. **Fehlerbehandlung**
   - HTTP-Fehler werden in CrawlResult.Error gespeichert
   - Fehlerhafte URLs brechen nicht den gesamten Crawl ab

#### `ExtractLinks(htmlContent string, baseURL *url.URL) ([]string, error)`
Extrahiert alle Links aus HTML:
- Findet alle `<a href="...">` Tags
- Konvertiert relative zu absoluten URLs
- Filtert invalide Schemes (javascript:, mailto:, etc.)
- Entfernt Fragments (#anchor)
- Gibt absolute URLs zurück

**Library-Hinweis**: Verwende `golang.org/x/net/html` für HTML-Parsing

#### `ExtractTitle(htmlContent string) string`
Extrahiert `<title>` Tag-Inhalt:
- Gibt leeren String zurück wenn nicht gefunden
- Trimmt Whitespace

#### `IsSameDomain(url1, url2 string) bool`
Vergleicht Domains zweier URLs:
- `http://example.com` vs `https://example.com` → `true` (Schema egal)
- `example.com` vs `sub.example.com` → `false`

#### `NormalizeURL(rawURL string) (string, error)`
Normalisiert URLs für Duplikat-Check:
- Schema + Host → Lowercase
- Entfernt Fragment
- Entfernt trailing Slash (außer bei Root `/`)
- Optional: Sortiere Query-Parameter

#### `GetDomain(rawURL string) (string, error)`
Extrahiert Domain (Host ohne Port):
- `http://example.com:8080/path` → `example.com`

## Implementierungs-Hinweise

### Worker-Pool Pattern

```go
type workItem struct {
    url   string
    depth int
}

// Channel für Work Items
workQueue := make(chan workItem, 100)

// Worker Goroutines
for i := 0; i < config.MaxConcurrent; i++ {
    go func() {
        for item := range workQueue {
            // Crawl URL
            result := crawlURL(item.url)
            // Extract links und zu workQueue hinzufügen
        }
    }()
}
```

### Visited-Tracking (Thread-Safe)

```go
type visitedMap struct {
    mu      sync.Mutex
    visited map[string]bool
}

func (v *visitedMap) Add(url string) bool {
    v.mu.Lock()
    defer v.mu.Unlock()

    if v.visited[url] {
        return false // Already visited
    }
    v.visited[url] = true
    return true // Newly added
}
```

### Rate Limiting per Domain

```go
type rateLimiter struct {
    mu          sync.Mutex
    lastRequest map[string]time.Time
}

func (r *rateLimiter) Wait(domain string, delay time.Duration) {
    r.mu.Lock()
    last := r.lastRequest[domain]
    r.mu.Unlock()

    elapsed := time.Since(last)
    if elapsed < delay {
        time.Sleep(delay - elapsed)
    }

    r.mu.Lock()
    r.lastRequest[domain] = time.Now()
    r.mu.Unlock()
}
```

### Dependencies

```bash
go get golang.org/x/net/html
```

## Komplexität

- **Zeit**: O(n) für n gecrawlte Seiten (bei optimaler Concurrency)
- **Space**: O(n) für visited-Map und Results
- **HTTP**: O(MaxConcurrent) gleichzeitige Requests

## Beispiel

```go
config := CrawlerConfig{
    MaxDepth:      2,
    MaxConcurrent: 5,
    Timeout:       10 * time.Second,
    MaxPages:      50,
    UserAgent:     "MyCrawler/1.0",
}

crawler, _ := NewCrawler(config)

ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

results, err := crawler.Crawl(ctx, "https://example.com")
if err != nil {
    log.Fatal(err)
}

for _, result := range results {
    if result.Error != nil {
        fmt.Printf("ERROR %s: %v\n", result.URL, result.Error)
    } else {
        fmt.Printf("OK %s - %s (%d links)\n",
            result.URL, result.Title, len(result.Links))
    }
}
```

## Ausführen

```bash
# Tests ausführen
go test ./test/...

# Mit Verbose-Output
go test -v ./test/...

# Mit Coverage
go test -cover ./test/...

# Spezifische Tests
go test -run TestCrawl_MaxDepth ./test/
```

## Bewertungskriterien

1. **Korrektheit** (35%): Alle Tests bestehen
2. **Concurrency** (25%): Korrekter Einsatz von Goroutines/Channels
3. **Thread-Safety** (20%): Keine Race Conditions
4. **Context-Handling** (10%): Korrekte Timeout/Cancellation
5. **Code-Qualität** (10%): Idiomatisches Go, Fehlerbehandlung

## Tipps

1. Beginne mit sequentiellem Crawling (ohne Concurrency)
2. Füge Worker-Pool hinzu
3. Implementiere visited-Tracking mit Mutex
4. Füge Rate-Limiting hinzu
5. Teste mit `go test -race` für Race Conditions
6. Verwende `select` mit `ctx.Done()` für Context-Support

## Häufige Fallen

- **Race Conditions**: Verwende immer Locks für shared State
- **Deadlocks**: Achte auf Channel-Blocking (buffered channels helfen)
- **Goroutine Leaks**: Stelle sicher, dass alle Goroutines terminieren
- **Infinite Loops**: URL-Normalisierung wichtig für Duplikat-Erkennung

Viel Erfolg! 🚀
