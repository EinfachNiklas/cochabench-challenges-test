import { create, all } from '../node_modules/mathjs/lib/esm/index.js';

const math = create(all);

describe('median', () => {
  test('sollte als Funktion existieren', () => {
    expect(typeof math.median).toBe('function');
  });

  test('berechnet Median für ungerade Anzahl von Elementen', () => {
    expect(math.median([1, 3, 5, 7, 9])).toBe(5);
    expect(math.median([5, 1, 9, 3, 7])).toBe(5); // unsortiert
  });

  test('berechnet Median für gerade Anzahl von Elementen', () => {
    expect(math.median([1, 2, 3, 4])).toBe(2.5);
    expect(math.median([4, 1, 3, 2])).toBe(2.5); // unsortiert
  });

  test('funktioniert mit einem Element', () => {
    expect(math.median([42])).toBe(42);
  });

  test('funktioniert mit zwei Elementen', () => {
    expect(math.median([10, 20])).toBe(15);
  });

  test('gibt undefined für leeres Array zurück', () => {
    expect(math.median([])).toBeUndefined();
  });

  test('funktioniert mit negativen Zahlen', () => {
    expect(math.median([-5, -1, -3])).toBe(-3);
    expect(math.median([-10, 10])).toBe(0);
  });

  test('funktioniert mit Dezimalzahlen', () => {
    expect(math.median([1.5, 2.5, 3.5])).toBe(2.5);
  });

  test('funktioniert mit Matrix-Objekten', () => {
    const matrix = math.matrix([1, 2, 3, 4, 5]);
    const result = math.median(matrix);
    expect(result).toBe(3);
  });

  test('funktioniert mit 2D-Matrix (flacht ab)', () => {
    const matrix = math.matrix([[1, 2], [3, 4]]);
    const result = math.median(matrix);
    expect(result).toBe(2.5);
  });

  test('funktioniert im Expression Parser', () => {
    expect(math.evaluate('median([1, 2, 3, 4, 5])')).toBe(3);
    expect(math.evaluate('median([10, 20, 30, 40])')).toBe(25);
  });

  test('funktioniert mit BigNumbers', () => {
    const bigMath = create(all, { number: 'BigNumber' });
    const result = bigMath.median([
      bigMath.bignumber('1'),
      bigMath.bignumber('2'),
      bigMath.bignumber('3')
    ]);
    expect(bigMath.format(result)).toBe('2');
  });

  test('behandelt Duplikate korrekt', () => {
    expect(math.median([1, 2, 2, 3])).toBe(2);
    expect(math.median([5, 5, 5, 5])).toBe(5);
  });

  test('funktioniert mit großen Arrays', () => {
    const largeArray = Array.from({ length: 1001 }, (_, i) => i);
    expect(math.median(largeArray)).toBe(500);
  });

  test('wirft Fehler für ungültige Eingabe', () => {
    expect(() => math.median('not an array')).toThrow();
    expect(() => math.median(null)).toThrow();
  });

  test('sortiert intern ohne Original-Array zu verändern', () => {
    const original = [5, 2, 8, 1, 9];
    const copy = [...original];
    math.median(original);
    expect(original).toEqual(copy);
  });
});
