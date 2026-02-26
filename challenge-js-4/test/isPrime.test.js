import { create, all } from '../node_modules/mathjs/lib/esm/index.js';

const math = create(all);

describe('isPrime', () => {
  test('sollte als Funktion existieren', () => {
    expect(typeof math.isPrime).toBe('function');
  });

  test('erkennt kleine Primzahlen', () => {
    expect(math.isPrime(2)).toBe(true);
    expect(math.isPrime(3)).toBe(true);
    expect(math.isPrime(5)).toBe(true);
    expect(math.isPrime(7)).toBe(true);
    expect(math.isPrime(11)).toBe(true);
    expect(math.isPrime(13)).toBe(true);
  });

  test('erkennt kleine Nicht-Primzahlen', () => {
    expect(math.isPrime(4)).toBe(false);
    expect(math.isPrime(6)).toBe(false);
    expect(math.isPrime(8)).toBe(false);
    expect(math.isPrime(9)).toBe(false);
    expect(math.isPrime(10)).toBe(false);
    expect(math.isPrime(12)).toBe(false);
  });

  test('behandelt Sonderfälle', () => {
    expect(math.isPrime(0)).toBe(false);
    expect(math.isPrime(1)).toBe(false);
    expect(math.isPrime(-1)).toBe(false);
    expect(math.isPrime(-7)).toBe(false);
  });

  test('funktioniert mit größeren Primzahlen', () => {
    expect(math.isPrime(97)).toBe(true);
    expect(math.isPrime(101)).toBe(true);
    expect(math.isPrime(997)).toBe(true);
    expect(math.isPrime(7919)).toBe(true);
  });

  test('funktioniert mit größeren Nicht-Primzahlen', () => {
    expect(math.isPrime(100)).toBe(false);
    expect(math.isPrime(1000)).toBe(false);
    expect(math.isPrime(10000)).toBe(false);
  });

  test('erkennt Quadratzahlen als Nicht-Prim', () => {
    expect(math.isPrime(4)).toBe(false);
    expect(math.isPrime(9)).toBe(false);
    expect(math.isPrime(16)).toBe(false);
    expect(math.isPrime(25)).toBe(false);
    expect(math.isPrime(121)).toBe(false);
  });

  test('funktioniert im Expression Parser', () => {
    expect(math.evaluate('isPrime(7)')).toBe(true);
    expect(math.evaluate('isPrime(10)')).toBe(false);
    expect(math.evaluate('isPrime(2)')).toBe(true);
  });

  test('funktioniert mit BigInt', () => {
    expect(math.isPrime(BigInt(17))).toBe(true);
    expect(math.isPrime(BigInt(18))).toBe(false);
  });

  test('ist effizient für größere Zahlen', () => {
    const start = Date.now();
    expect(math.isPrime(15485863)).toBe(true); // Eine große Primzahl
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100); // Sollte schnell sein
  });

  test('behandelt gerade Zahlen effizient', () => {
    expect(math.isPrime(1000000)).toBe(false);
    expect(math.isPrime(999998)).toBe(false);
  });

  test('wirft Fehler für Dezimalzahlen', () => {
    expect(() => math.isPrime(7.5)).toThrow();
    expect(() => math.isPrime(3.14)).toThrow();
  });

  test('wirft Fehler für ungültige Eingabe', () => {
    expect(() => math.isPrime('7')).toThrow();
    expect(() => math.isPrime(null)).toThrow();
    expect(() => math.isPrime(undefined)).toThrow();
  });

  test('Mersenne-Primzahlen', () => {
    expect(math.isPrime(31)).toBe(true);    // 2^5 - 1
    expect(math.isPrime(127)).toBe(true);   // 2^7 - 1
    expect(math.isPrime(8191)).toBe(true);  // 2^13 - 1
  });

  test('Pseudo-Primzahlen (sollten als nicht-prim erkannt werden)', () => {
    expect(math.isPrime(341)).toBe(false);  // 11 × 31 (Fermat-Pseudoprimzahl)
    expect(math.isPrime(561)).toBe(false);  // 3 × 11 × 17 (Carmichael-Zahl)
  });

  test('Twin-Primzahlen', () => {
    expect(math.isPrime(11)).toBe(true);
    expect(math.isPrime(13)).toBe(true);
    expect(math.isPrime(17)).toBe(true);
    expect(math.isPrime(19)).toBe(true);
  });
});
