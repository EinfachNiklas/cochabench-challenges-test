import { create, all } from '../src/index.js';

const math = create(all);

describe('dotProduct', () => {
  test('sollte als Funktion existieren', () => {
    expect(typeof math.dotProduct).toBe('function');
  });

  test('berechnet einfaches Skalarprodukt', () => {
    expect(math.dotProduct([1, 2, 3], [4, 5, 6])).toBe(32); // 1*4 + 2*5 + 3*6
  });

  test('funktioniert mit zweidimensionalen Vektoren', () => {
    expect(math.dotProduct([1, 2], [3, 4])).toBe(11); // 1*3 + 2*4
    expect(math.dotProduct([5, 12], [3, 4])).toBe(63); // 5*3 + 12*4
  });

  test('funktioniert mit eindimensionalen Vektoren', () => {
    expect(math.dotProduct([7], [5])).toBe(35);
  });

  test('funktioniert mit Nullvektoren', () => {
    expect(math.dotProduct([0, 0, 0], [1, 2, 3])).toBe(0);
    expect(math.dotProduct([1, 2, 3], [0, 0, 0])).toBe(0);
  });

  test('funktioniert mit negativen Zahlen', () => {
    expect(math.dotProduct([1, -2, 3], [4, 5, -6])).toBe(-24); // 1*4 + (-2)*5 + 3*(-6)
  });

  test('funktioniert mit Dezimalzahlen', () => {
    expect(math.dotProduct([1.5, 2.5], [2, 3])).toBeCloseTo(10.5, 5); // 1.5*2 + 2.5*3
  });

  test('funktioniert mit Matrix-Objekten', () => {
    const a = math.matrix([1, 2, 3]);
    const b = math.matrix([4, 5, 6]);
    expect(math.dotProduct(a, b)).toBe(32);
  });

  test('funktioniert mit gemischten Typen (Array und Matrix)', () => {
    const matrix = math.matrix([1, 2, 3]);
    expect(math.dotProduct(matrix, [4, 5, 6])).toBe(32);
    expect(math.dotProduct([1, 2, 3], matrix)).toBe(32);
  });

  test('wirft Fehler bei unterschiedlichen Längen', () => {
    expect(() => math.dotProduct([1, 2], [1, 2, 3])).toThrow();
    expect(() => math.dotProduct([1, 2, 3, 4], [1, 2])).toThrow();
  });

  test('wirft Fehler bei leeren Vektoren', () => {
    expect(() => math.dotProduct([], [])).toThrow();
  });

  test('wirft Fehler bei mehrdimensionalen Matrizen', () => {
    expect(() => math.dotProduct([[1, 2], [3, 4]], [1, 2])).toThrow();
  });

  test('funktioniert im Expression Parser', () => {
    expect(math.evaluate('dotProduct([1, 2, 3], [4, 5, 6])')).toBe(32);
  });

  test('funktioniert mit längeren Vektoren', () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const b = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    expect(math.dotProduct(a, b)).toBe(220);
  });

  test('funktioniert mit Complex Numbers', () => {
    const a = [math.complex(1, 0), math.complex(2, 0)];
    const b = [math.complex(3, 0), math.complex(4, 0)];
    const result = math.dotProduct(a, b);
    expect(math.re(result)).toBe(11);
    expect(math.im(result)).toBe(0);
  });

  test('Orthogonale Vektoren haben Skalarprodukt 0', () => {
    expect(math.dotProduct([1, 0], [0, 1])).toBe(0);
    expect(math.dotProduct([3, 0, 0], [0, 5, 0])).toBe(0);
  });

  test('Identische Vektoren', () => {
    expect(math.dotProduct([2, 3, 4], [2, 3, 4])).toBe(29); // 4 + 9 + 16
  });

  test('ist kommutativ', () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    expect(math.dotProduct(a, b)).toBe(math.dotProduct(b, a));
  });

  test('funktioniert mit BigNumbers', () => {
    const bigMath = create(all, { number: 'BigNumber' });
    const a = [bigMath.bignumber('1'), bigMath.bignumber('2')];
    const b = [bigMath.bignumber('3'), bigMath.bignumber('4')];
    const result = bigMath.dotProduct(a, b);
    expect(bigMath.format(result)).toBe('11');
  });

  test('Performance mit großen Vektoren', () => {
    const size = 10000;
    const a = Array.from({ length: size }, (_, i) => i);
    const b = Array.from({ length: size }, (_, i) => i);
    const start = Date.now();
    const result = math.dotProduct(a, b);
    const duration = Date.now() - start;
    expect(typeof result).toBe('number');
    expect(duration).toBeLessThan(100); // Sollte schnell sein
  });
});
