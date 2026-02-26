import { create, all } from '../node_modules/mathjs/lib/esm/index.js';

const math = create(all);

describe('combinations', () => {
  test('sollte als Funktion existieren', () => {
    expect(typeof math.combinations).toBe('function');
  });

  test('berechnet einfache Kombinationen', () => {
    expect(math.combinations(5, 2)).toBe(10); // 5!/(2!*3!) = 10
    expect(math.combinations(4, 2)).toBe(6);  // 4!/(2!*2!) = 6
    expect(math.combinations(6, 3)).toBe(20); // 6!/(3!*3!) = 20
  });

  test('behandelt Randfälle', () => {
    expect(math.combinations(5, 0)).toBe(1);  // n über 0 = 1
    expect(math.combinations(5, 5)).toBe(1);  // n über n = 1
    expect(math.combinations(0, 0)).toBe(1);  // 0 über 0 = 1
  });

  test('gibt 0 zurück wenn k > n', () => {
    expect(math.combinations(3, 5)).toBe(0);
    expect(math.combinations(0, 1)).toBe(0);
  });

  test('funktioniert mit größeren Zahlen', () => {
    expect(math.combinations(10, 5)).toBe(252);
    expect(math.combinations(20, 10)).toBe(184756);
  });

  test('Pascal\'s Dreieck Eigenschaften', () => {
    // C(n,k) = C(n-1,k-1) + C(n-1,k)
    const n = 7, k = 3;
    expect(math.combinations(n, k)).toBe(
      math.combinations(n - 1, k - 1) + math.combinations(n - 1, k)
    );
  });

  test('Symmetrie: C(n,k) = C(n,n-k)', () => {
    expect(math.combinations(10, 3)).toBe(math.combinations(10, 7));
    expect(math.combinations(8, 2)).toBe(math.combinations(8, 6));
  });

  test('funktioniert im Expression Parser', () => {
    expect(math.evaluate('combinations(5, 2)')).toBe(10);
    expect(math.evaluate('combinations(10, 3)')).toBe(120);
  });

  test('wirft Fehler für negative Zahlen', () => {
    expect(() => math.combinations(-5, 2)).toThrow();
    expect(() => math.combinations(5, -2)).toThrow();
  });

  test('wirft Fehler für Dezimalzahlen', () => {
    expect(() => math.combinations(5.5, 2)).toThrow();
    expect(() => math.combinations(5, 2.5)).toThrow();
  });

  test('funktioniert mit k=1', () => {
    expect(math.combinations(5, 1)).toBe(5);
    expect(math.combinations(100, 1)).toBe(100);
  });

  test('funktioniert mit sehr großen Zahlen (sollte nicht überlaufen)', () => {
    // Diese Werte können sehr groß werden
    expect(math.combinations(30, 15)).toBeGreaterThan(0);
    expect(Number.isFinite(math.combinations(30, 15))).toBe(true);
  });

  test('Bekannte Kombinationen', () => {
    expect(math.combinations(52, 5)).toBe(2598960);  // Poker Hands
    expect(math.combinations(49, 6)).toBe(13983816); // Lotto 6 aus 49
  });

  test('funktioniert mit BigInt', () => {
    const result = math.combinations(BigInt(10), BigInt(5));
    expect(result).toBe(BigInt(252));
  });

  test('funktioniert mit BigNumber', () => {
    const bigMath = create(all, { number: 'BigNumber' });
    const result = bigMath.combinations(
      bigMath.bignumber('10'),
      bigMath.bignumber('5')
    );
    expect(bigMath.format(result)).toBe('252');
  });

  test('Performance-Test: sollte effizient sein (nicht über Fakultät)', () => {
    const start = Date.now();
    math.combinations(1000, 500);
    const duration = Date.now() - start;
    // Wenn über Fakultät implementiert, würde dies sehr lange dauern oder fehlschlagen
    expect(duration).toBeLessThan(1000);
  });

  test('Sehr große Kombinationen mit BigNumber', () => {
    const bigMath = create(all, { number: 'BigNumber' });
    // Diese Zahl wäre zu groß für normale Number
    const result = bigMath.combinations(
      bigMath.bignumber('100'),
      bigMath.bignumber('50')
    );
    expect(typeof bigMath.format(result)).toBe('string');
    expect(bigMath.format(result).length).toBeGreaterThan(20); // Sehr große Zahl
  });

  test('Binomialkoeffizient Formeln', () => {
    // Summe aller C(n,k) für k=0..n = 2^n
    const n = 5;
    let sum = 0;
    for (let k = 0; k <= n; k++) {
      sum += math.combinations(n, k);
    }
    expect(sum).toBe(Math.pow(2, n));
  });

  test('wirft Fehler für ungültige Typen', () => {
    expect(() => math.combinations('5', 2)).toThrow();
    expect(() => math.combinations(null, 2)).toThrow();
    expect(() => math.combinations(undefined, 2)).toThrow();
  });

  test('Aufsteigende Reihe', () => {
    // C(n, 0) < C(n, 1) < ... bis zum Maximum, dann absteigend
    const values = [0, 1, 2, 3, 4, 5].map(k => math.combinations(5, k));
    // [1, 5, 10, 10, 5, 1]
    expect(values[0]).toBe(1);
    expect(values[1]).toBe(5);
    expect(values[2]).toBe(10);
    expect(values[3]).toBe(10);
    expect(values[4]).toBe(5);
    expect(values[5]).toBe(1);
  });
});
