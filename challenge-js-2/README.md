# Merge Intervals (JavaScript)

## Aufgabe
Schreibe `mergeIntervals(intervals)`, die eine Liste von Intervallen zusammenführt.

- Ein Intervall ist ein Array `[start, end]` (Zahlen, `start <= end`).
- Die Eingabe kann unsortiert sein.
- Intervalle, die sich überlappen oder berühren, werden zusammengeführt:
  - Beispiel: `[1,2]` und `[2,3]` => `[1,3]`
- Rückgabe: neue Liste zusammengeführter Intervalle, sortiert nach `start`.
- Die Funktion soll die Eingabe nicht mutieren.

## Beispiele
Input: `[[1,3],[2,6],[8,10],[15,18]]`
Output: `[[1,6],[8,10],[15,18]]`

Input: `[[1,2],[2,3]]`
Output: `[[1,3]]`

## Ausführen
Voraussetzung: Node.js >= 18

```bash
npm test

