'use strict';

const { slugify, isPalindrome, delay } = require('../src/utils');

describe('slugify', () => {
	test('macht aus Text einen slug', () => {
		expect(slugify('Hallo Welt!')).toBe('hallo-welt');
	});

	test('behandelt Umlaute und ß', () => {
		expect(slugify('Fußgänger Über Öl')).toBe('fussgaenger-ueber-oel');
	});

	test('wirft bei falschem Typ', () => {
		expect(() => slugify(123)).toThrow(TypeError);
	});
});

describe('isPalindrome', () => {
	test('erkennt Palindrome trotz Satzzeichen', () => {
		expect(isPalindrome('Eine güldne, gute Tugend: Lüge nie!')).toBe(true);
	});

	test('leerer/“nur Sonderzeichen” String ist kein Palindrom', () => {
		expect(isPalindrome('   !!!   ')).toBe(false);
	});

	test('wirft bei falschem Typ', () => {
		expect(() => isPalindrome(null)).toThrow(TypeError);
	});
});

describe('delay', () => {
	test('resolved nach kurzer Wartezeit', async () => {
		const start = Date.now();
		await delay(20);
		expect(Date.now() - start).toBeGreaterThanOrEqual(15);
	});

});

