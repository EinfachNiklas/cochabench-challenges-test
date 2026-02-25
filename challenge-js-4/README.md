# Math.js Extension Challenge (JavaScript)

> **Note:** This challenge is based on [math.js](https://github.com/josdejong/mathjs) by Jos de Jong, licensed under Apache 2.0.
> See [CHALLENGE_NOTICE.md](CHALLENGE_NOTICE.md) for full license information.

## Aufgabe

Erweitere die math.js Bibliothek um neue mathematische Funktionen. Diese Challenge testet deine Fähigkeit, dich in einer großen, professionellen Codebasis zurechtzufinden und nach deren Architektur-Patterns neue Features zu implementieren.

### Kontext

[math.js](https://mathjs.org) ist eine umfangreiche Mathematik-Bibliothek für JavaScript. Sie verwendet **Dependency Injection** und **Typed Functions** um verschiedene Datentypen (Number, BigNumber, Complex, Matrices, etc.) zu unterstützen.

**Hinweis:** Die Codebasis wurde für diese Challenge auf die relevanten Kern-Komponenten reduziert (~690 Dateien). Dokumentation und Beispiele wurden entfernt - du musst dich auf den Code selbst und bestehende Implementierungen als Vorlage verlassen.

In dieser Challenge musst du:
1. Die Architektur von math.js verstehen
2. Bestehende Implementierungen als Vorlage analysieren
3. Neue Funktionen nach dem gleichen Pattern implementieren
4. Die Factory-Pattern und Dependency-Injection korrekt verwenden

## Zu implementierende Funktionen

### 1. `median(array)` ⭐⭐ (Mittelschwer)

Berechnet den Median eines Arrays von Zahlen.

**Anforderungen:**
- Implementiere als Factory Function in `src/src/function/statistics/median.js`
- Unterstütze Number, BigNumber und Fractions
- Sortiere das Array und gib den mittleren Wert zurück
- Bei gerader Anzahl: Durchschnitt der beiden mittleren Werte
- Funktioniert mit eindimensionalen Arrays und Matrizen

**Beispiel:**
```javascript
math.median([1, 3, 5, 7])      // 4
math.median([1, 3, 5, 7, 9])   // 5
math.median([])                // undefined
```

**Hinweise:**
- Schaue dir `src/src/function/statistics/mean.js` als Vorlage an
- Du benötigst Dependencies: `typed`, `add`, `divide`, `compare`, `flatten`
- Erstelle auch Embedded Docs in `src/src/expression/embeddedDocs/function/statistics/median.js`

---

### 2. `isPrime(n)` ⭐⭐ (Mittelschwer)

Prüft, ob eine Zahl eine Primzahl ist.

**Anforderungen:**
- Implementiere als Factory Function in `src/src/function/number/isPrime.js`
- Unterstütze Number und BigInt
- Effizient für große Zahlen (bis zu 10^12)
- Negative Zahlen und Zahlen < 2 sind keine Primzahlen

**Beispiel:**
```javascript
math.isPrime(7)       // true
math.isPrime(10)      // false
math.isPrime(2)       // true
math.isPrime(1)       // false
math.isPrime(-5)      // false
```

**Hinweise:**
- Schaue dir `src/src/function/arithmetic/gcd.js` als Beispiel für Number-Operations an
- Verwende Trial Division mit Optimierung (nur bis sqrt(n) testen)
- Checke gerade Zahlen separat für Performance

---

### 3. `dotProduct(a, b)` ⭐⭐⭐ (Schwer)

Berechnet das Skalarprodukt zweier Vektoren.

**Anforderungen:**
- Implementiere als Factory Function in `src/src/function/matrix/dotProduct.js`
- Unterstütze Arrays und Matrix-Objekte
- Funktioniert mit allen Datentypen (Number, BigNumber, Complex, etc.)
- Wirft Fehler wenn Vektoren unterschiedliche Länge haben
- Unterstützt n-dimensionale Vektoren

**Beispiel:**
```javascript
math.dotProduct([1, 2, 3], [4, 5, 6])           // 32 (1*4 + 2*5 + 3*6)
math.dotProduct([1, 2], [3, 4])                 // 11
math.dotProduct(
  math.matrix([1, 2]),
  math.matrix([3, 4])
)                                                // 11

// Mit Complex Numbers
math.dotProduct(
  [math.complex(1, 2), math.complex(3, 4)],
  [math.complex(5, 0), math.complex(1, 1)]
)
```

**Hinweise:**
- Schaue dir `src/src/function/matrix/multiply.js` als Vorlage an
- Du benötigst: `typed`, `multiply`, `add`, `flatten`
- Verwende `flatten` um Matrizen in Arrays zu konvertieren
- Matrix muss eindimensional sein

---

### 4. `combinations(n, k)` ⭐⭐⭐⭐ (Sehr schwer)

Berechnet die Anzahl der Kombinationen: n über k = n! / (k! * (n-k)!)

**Anforderungen:**
- Implementiere als Factory Function in `src/src/function/combinatorics/combinations.js`
- Unterstütze Number, BigNumber und BigInt
- Effizient berechnen (NICHT über Fakultäten!)
- Verwende iterativen Ansatz: C(n,k) = n * (n-1) * ... * (n-k+1) / k!
- Validierung: n >= 0, k >= 0, k <= n

**Beispiel:**
```javascript
math.combinations(5, 2)       // 10
math.combinations(10, 3)      // 120
math.combinations(0, 0)       // 1
math.combinations(5, 0)       // 1
math.combinations(3, 5)       // 0 (k > n)
```

**Hinweise:**
- Schaue dir `src/src/function/probability/permutations.js` an (falls vorhanden)
- Alternative: Schaue `src/src/function/arithmetic/factorial.js` an
- Verwende `multiply` und `divide` aus Dependencies
- Optimierung: Verwende min(k, n-k) um kleinere Iteration zu haben

---

## Architektur-Anforderungen

Alle Funktionen **MÜSSEN** dem math.js Factory Pattern folgen:

```javascript
export const createMyFunction = factory('myFunction', ['dependency1', 'dependency2'], ({ dependency1, dependency2 }) => {
  return typed('myFunction', {
    'number': function(x) {
      // implementation
    },
    'BigNumber': function(x) {
      // implementation
    }
    // weitere Signaturen...
  })
})
```

### Integration Checklist

Für jede Funktion musst du:

1. ✅ **Factory Function erstellen** in richtigem Ordner
2. ✅ **Export hinzufügen** zu `src/src/factoriesAny.js`
3. ✅ **Embedded Docs erstellen** in `src/src/expression/embeddedDocs/function/...`
4. ✅ **Embedded Docs exportieren** in `src/src/expression/embeddedDocs/embeddedDocs.js`
5. ✅ **Tests schreiben** (siehe unten)

## Tests

Deine Implementierung wird gegen umfangreiche Tests geprüft:

```bash
npm install
npm test
```

Die Tests prüfen:
- Korrektheit der Berechnungen
- Unterstützung verschiedener Datentypen
- Edge Cases (leere Arrays, negative Zahlen, etc.)
- Fehlerbehandlung
- Integration in math.js Expression Parser

## Bewertungskriterien

1. **Korrektheit** (40%): Alle Tests bestehen
2. **Architektur** (30%): Korrekte Verwendung von Factory Pattern, Dependencies, Typed Functions
3. **Code-Qualität** (20%): Lesbar, wartbar, dokumentiert
4. **Edge Cases** (10%): Robuste Fehlerbehandlung

## Hilfreiche Ressourcen

- **Architektur-Dokumentation**: `src/README.md` (Abschnitt "Architecture")
- **Beispiel-Funktionen**:
  - Einfach: `src/src/function/arithmetic/abs.js`
  - Mit Arrays: `src/src/function/statistics/mean.js`
  - Mit Matrizen: `src/src/function/matrix/transpose.js`
- **Factory Pattern**: `src/src/core/create.js`
- **Typed Functions**: Alle Dependencies verwenden `typed()`

## Navigation in der Codebasis

Die wichtigsten Ordner:

```
challenge-js-4/src/
├── src/
│   ├── function/
│   │   ├── arithmetic/      # Grundrechenarten
│   │   ├── statistics/      # Statistische Funktionen
│   │   ├── matrix/          # Matrix-Operationen
│   │   ├── combinatorics/   # Kombinatorik
│   │   └── number/          # Zahlen-Operationen
│   ├── expression/
│   │   └── embeddedDocs/    # Dokumentation für Parser
│   ├── factoriesAny.js      # Hier Exports hinzufügen
│   └── core/                # Factory System
└── test/                    # Deine Tests (vom System bereitgestellt)
```

## Tipps

1. **Beginne mit `median`** - am einfachsten, gute Einführung
2. **Studiere ähnliche Funktionen** - Kopiere deren Struktur
3. **Typed Functions sind wichtig** - Sie ermöglichen Polymorphismus
4. **Dependencies explizit angeben** - Keine direkten Imports
5. **Expression Parser testen**: `math.evaluate('median([1,2,3])')`
6. **Bei Problemen**: Schaue dir die Error Messages genau an - sie zeigen oft fehlende Exports

## Challenge-Ziel

Diese Challenge simuliert reale Software-Entwicklung:
- Arbeiten mit großer, fremder Codebasis
- Verstehen existierender Patterns
- Integration neuer Features
- Maintainability und Konsistenz

Viel Erfolg! 🚀

**Geschätzte Bearbeitungszeit**: 4-6 Stunden
**Schwierigkeitsgrad**: ⭐⭐⭐⭐ (Schwer bis Sehr Schwer)
