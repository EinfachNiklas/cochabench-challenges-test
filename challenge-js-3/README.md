# Graph Pathfinding mit Constraints (JavaScript)

## Aufgabe

Implementiere mehrere fortgeschrittene Pathfinding-Algorithmen für gewichtete Graphen mit Budget-Constraints. Dies ist eine sehr anspruchsvolle Challenge, die ein tiefes Verständnis von Graph-Algorithmen erfordert.

### Kontext

In vielen realen Szenarien müssen wir Pfade finden, die nicht nur kurz sind, sondern auch zusätzliche Bedingungen erfüllen. Beispiele:
- Routenplanung mit Mautgebühren (minimiere Distanz, halte Maut-Budget ein)
- Netzwerk-Routing mit Latenz und Bandbreitenkosten
- Logistik mit Zeit- und Kostenoptimierung

### Graph-Format

Alle Funktionen arbeiten mit Graphen im folgenden Format:

```javascript
{
  'A': [
    { to: 'B', distance: 10, cost: 5 },
    { to: 'C', distance: 15, cost: 3 }
  ],
  'B': [
    { to: 'D', distance: 5, cost: 7 }
  ],
  'C': [],
  'D': []
}
```

Jede Kante hat zwei Metriken:
- **distance**: Die zu minimierende Hauptmetrik (z.B. Distanz, Zeit, Latenz)
- **cost**: Die Nebenmetrik mit Budget-Constraint (z.B. Kosten, Maut, Bandbreite)

## Zu implementierende Funktionen

### 1. `isValidGraph(graph)` ⭐ (Aufwärmen)

Validiert einen Graphen:
- Alle `to`-Knoten existieren als Keys im Graph
- Alle `distance` und `cost` Werte sind nicht-negative Zahlen
- Keine Selbst-Loops (Kanten von Knoten zu sich selbst)

**Beispiel:**
```javascript
const valid = {
  'A': [{ to: 'B', distance: 5, cost: 3 }],
  'B': []
};
isValidGraph(valid); // => true

const invalid = {
  'A': [{ to: 'Z', distance: 5, cost: 3 }]  // Z existiert nicht
};
isValidGraph(invalid); // => false
```

### 2. `findConstrainedPath(graph, start, end, maxCost)` ⭐⭐⭐ (Kern-Challenge)

Findet den kürzesten Pfad (minimale Distanz), der das Kosten-Budget nicht überschreitet.

**Constraints:**
- Die Summe aller `cost`-Werte auf dem Pfad darf `maxCost` nicht überschreiten
- Unter allen Pfaden, die das Budget einhalten, wähle den mit minimaler Gesamt-Distanz
- Keine Zyklen (Knoten dürfen nicht wiederholt werden)
- Return `null` wenn kein gültiger Pfad existiert

**Beispiel:**
```javascript
const graph = {
  'A': [
    { to: 'B', distance: 5, cost: 100 },  // kurz, aber teuer
    { to: 'C', distance: 10, cost: 5 }    // länger, aber günstig
  ],
  'B': [{ to: 'D', distance: 1, cost: 1 }],
  'C': [{ to: 'D', distance: 1, cost: 1 }],
  'D': []
};

// Mit Budget 50: kann nur A->C->D nehmen (A->B->D zu teuer)
findConstrainedPath(graph, 'A', 'D', 50);
// => { path: ['A', 'C', 'D'], totalDistance: 11, totalCost: 6 }

// Mit Budget 150: kann kürzeren Pfad A->B->D nehmen
findConstrainedPath(graph, 'A', 'D', 150);
// => { path: ['A', 'B', 'D'], totalDistance: 6, totalCost: 101 }
```

**Hinweise zur Implementierung:**
- Modifizierter Dijkstra-Algorithmus ist empfehlenswert
- State: `(node, remainingBudget)` oder `(node, costUsed)`
- Priority Queue nach Distanz sortiert
- Pruning: Zustände mit gleichem Knoten aber höheren Kosten können verworfen werden

### 3. `findKShortestPaths(graph, start, end, maxCost, k)` ⭐⭐⭐⭐ (Sehr schwer)

Findet die `k` kürzesten Pfade, die das Budget einhalten.

**Anforderungen:**
- Alle Pfade müssen das `maxCost`-Budget einhalten
- Rückgabe sortiert nach aufsteigender Distanz
- Pfade dürfen unterschiedlich sein
- Wenn weniger als `k` Pfade existieren, gib alle verfügbaren zurück

**Beispiel:**
```javascript
findKShortestPaths(graph, 'A', 'D', 100, 3);
// => [
//   { path: ['A', 'B', 'D'], totalDistance: 10, totalCost: 15 },
//   { path: ['A', 'C', 'D'], totalDistance: 12, totalCost: 20 },
//   { path: ['A', 'X', 'Y', 'D'], totalDistance: 15, totalCost: 25 }
// ]
```

**Hinweis:** Dies ist algorithmisch sehr anspruchsvoll. Yen's K-Shortest Path Algorithm oder A* Varianten können helfen.

### 4. `findPathWithWaypoints(graph, start, waypoints, end, maxCost)` ⭐⭐⭐⭐ (Schwer)

Findet den kürzesten Pfad von `start` nach `end`, der durch alle `waypoints` in der angegebenen Reihenfolge führt.

**Anforderungen:**
- Waypoints müssen in der gegebenen Reihenfolge besucht werden
- Gesamtkosten (über alle Segmente) dürfen `maxCost` nicht überschreiten
- Zwischen Waypoints soll jeweils der optimale Pfad gewählt werden

**Beispiel:**
```javascript
findPathWithWaypoints(graph, 'A', ['B', 'C'], 'D', 50);
// Sucht: A -> ... -> B -> ... -> C -> ... -> D
// Jedes Segment optimiert, aber Waypoints müssen in Reihenfolge
```

**Hinweis:** Teile das Problem in Segmente: `start -> waypoints[0]`, `waypoints[0] -> waypoints[1]`, ..., `waypoints[n] -> end`. Verwende `findConstrainedPath` als Subroutine.

## Komplexität

- **isValidGraph**: O(V + E) erwartet
- **findConstrainedPath**: O((V × maxCost) × log(V × maxCost)) im Worst-Case
- **findKShortestPaths**: O(k × V × (E + V log V)) oder besser
- **findPathWithWaypoints**: O(|waypoints| × Komplexität von findConstrainedPath)

## Ausführen

Voraussetzung: Node.js >= 18

```bash
npm install
npm test
```

Für Entwicklung mit Watch-Mode:
```bash
npm run test:watch
```

## Bewertungskriterien

1. **Korrektheit**: Alle Tests müssen bestehen
2. **Effizienz**: Algorithmus sollte auch für größere Graphen performant sein
3. **Code-Qualität**: Saubere Implementierung mit guter Lesbarkeit
4. **Edge Cases**: Umgang mit Sonderfällen (leerer Graph, start == end, etc.)

## Tipps

1. Beginne mit `isValidGraph` zum Aufwärmen
2. `findConstrainedPath` ist der Kern - wenn du diesen löst, hast du die Basis für die anderen
3. Verwende eine Priority Queue (z.B. über Array + Sort oder externe Library)
4. Denke an Memoization/Visited-Sets um Zyklen zu vermeiden
5. Die Kombination aus zwei Metriken macht das Problem NP-hard für den allgemeinen Fall - aber praktische Instanzen sind oft lösbar

Viel Erfolg! 🚀
