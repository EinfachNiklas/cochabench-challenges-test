# LRU Cache mit Time-to-Live (Python)

## Aufgabe

Implementiere eine vollständige LRU (Least Recently Used) Cache-Klasse mit Time-to-Live (TTL) Unterstützung und Thread-Safety.

## Kontext

Ein LRU Cache ist eine Datenstruktur, die häufig für Caching-Zwecke verwendet wird. Wenn der Cache voll ist, werden die am längsten nicht verwendeten Einträge entfernt. Diese Challenge erweitert einen einfachen LRU Cache um:

- **TTL (Time-to-Live)**: Einträge laufen nach einer bestimmten Zeit automatisch ab
- **Thread-Safety**: Der Cache muss in Multi-Threading-Umgebungen sicher verwendbar sein
- **Statistiken**: Tracking von Hits, Misses, Evictions und Expirations

## Anforderungen

### Klasse: `LRUCache`

```python
class LRUCache:
    def __init__(self, capacity: int, default_ttl: Optional[float] = None)
    def get(self, key: str) -> Optional[Any]
    def put(self, key: str, value: Any, ttl: Optional[float] = None) -> None
    def delete(self, key: str) -> bool
    def clear(self) -> None
    def size(self) -> int
    def cleanup_expired(self) -> int
    def get_stats(self) -> dict
```

### Detaillierte Spezifikation

#### `__init__(capacity, default_ttl=None)`
- `capacity`: Maximale Anzahl Einträge (muss > 0 sein)
- `default_ttl`: Standard TTL in Sekunden (None = kein Ablauf)
- Wirft `ValueError` bei ungültiger Kapazität

#### `get(key) -> Optional[Any]`
- Gibt den Wert für `key` zurück oder `None`
- Entfernt automatisch abgelaufene Einträge
- Markiert den Eintrag als "recently used" (bei Hit)
- Erhöht Hit/Miss Counter

#### `put(key, value, ttl=None)`
- Fügt Eintrag hinzu oder aktualisiert ihn
- `ttl`: Individuelle TTL (None = default_ttl verwenden)
- Bei vollem Cache: Entfernt LRU-Eintrag (Eviction)
- Markiert Eintrag als "recently used"

#### `delete(key) -> bool`
- Entfernt Eintrag explizit
- Gibt `True` zurück wenn erfolgreich, sonst `False`

#### `clear()`
- Entfernt alle Einträge aus dem Cache

#### `size() -> int`
- Gibt Anzahl der aktuell gültigen Einträge zurück

#### `cleanup_expired() -> int`
- Entfernt alle abgelaufenen Einträge
- Gibt Anzahl der entfernten Einträge zurück

#### `get_stats() -> dict`
Gibt Dictionary mit folgenden Keys zurück:
- `'hits'`: Anzahl erfolgreicher `get()`-Aufrufe
- `'misses'`: Anzahl fehlgeschlagener `get()`-Aufrufe
- `'evictions'`: Anzahl der LRU-Evictions
- `'expired'`: Anzahl der TTL-Expirations
- `'size'`: Aktuelle Anzahl Einträge
- `'capacity'`: Maximale Kapazität

## Implementierungs-Hinweise

### LRU-Tracking
- Verwende eine **Doubly Linked List** + **HashMap** für O(1) get/put
- Alternativ: `collections.OrderedDict` (Python-spezifisch)
- Bei jedem Zugriff (get/put): Eintrag an den Anfang verschieben
- Bei Eviction: Letzten Eintrag entfernen

### TTL-Tracking
- Speichere Ablaufzeitpunkt pro Eintrag (z.B. `time.time() + ttl`)
- Prüfe bei `get()` ob Eintrag abgelaufen ist
- Erwäge Lazy Deletion (nur bei Zugriff prüfen) vs. Active Cleanup

### Thread-Safety
- Verwende `threading.Lock()` um kritische Abschnitte zu schützen
- Alle Methoden müssen thread-safe sein
- Achte auf Deadlock-Vermeidung

### Statistiken
- Interne Counter für hits, misses, evictions, expired
- `get_stats()` gibt Snapshot zurück

## Komplexität

- **get()**: O(1) durchschnittlich
- **put()**: O(1) durchschnittlich
- **cleanup_expired()**: O(n) im Worst Case

## Beispiel

```python
cache = LRUCache(capacity=3, default_ttl=5.0)

# Einfügen
cache.put("user:1", {"name": "Alice"})
cache.put("user:2", {"name": "Bob"})
cache.put("user:3", {"name": "Charlie"})

# Abrufen
user = cache.get("user:1")  # Hit: {"name": "Alice"}

# Cache voll - LRU Eviction
cache.put("user:4", {"name": "David"})  # user:2 wird entfernt

# TTL
cache.put("session", "abc123", ttl=1.0)  # Läuft nach 1 Sekunde ab
time.sleep(1.5)
session = cache.get("session")  # None (abgelaufen)

# Statistiken
stats = cache.get_stats()
# {'hits': 1, 'misses': 1, 'evictions': 1, 'expired': 1, ...}
```

## Ausführen

Voraussetzung: Python >= 3.8

```bash
# Tests ausführen
python -m pytest test/

# Oder mit unittest
python -m unittest discover test/

# Mit Coverage
python -m pytest --cov=src test/
```

## Bewertungskriterien

1. **Korrektheit** (40%): Alle Tests bestehen
2. **LRU-Implementierung** (25%): Korrektes Eviction-Verhalten
3. **TTL-Funktionalität** (20%): Ablaufen von Einträgen
4. **Thread-Safety** (10%): Keine Race Conditions
5. **Code-Qualität** (5%): Lesbarkeit, Struktur

## Tipps

1. Beginne mit der Basis-Funktionalität (get/put ohne TTL)
2. Füge dann LRU-Eviction hinzu
3. Implementiere TTL-Support
4. Abschließend: Thread-Safety mit Locks
5. Teste ausgiebig Edge Cases (capacity=1, concurrent access, etc.)

Viel Erfolg! 🐍
