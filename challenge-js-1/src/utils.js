'use strict';

/**
 * Wandelt einen String in einen URL-tauglichen "slug" um.
 * Beispiel: "Hallo Welt!" -> "hallo-welt"
 */
function slugify(input) {
	if (typeof input !== 'string') throw new TypeError('input must be a string');

	return input
		.trim()
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-') // alles Nicht-Alphanumerische zu "-"
		.replace(/^-+|-+$/g, ''); // führende/abschließende "-" entfernen
}

/**
 * Prüft, ob ein String ein Palindrom ist (ignoriert Leerzeichen/Interpunktion).
 */
function isPalindrome(input) {
	if (typeof input !== 'string') throw new TypeError('input must be a string');

	const normalized = input.toLowerCase().replace(/[^a-z0-9]+/g, '');
	const reversed = normalized.split('').reverse().join('');
	return normalized.length > 0 && normalized === reversed;
}

/**
 * Asynchrone Utility: wartet ms Millisekunden.
 */
function delay(ms) {
	if (!Number.isFinite(ms) || ms < 0) throw new TypeError('ms must be a non-negative number');

	return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { slugify, isPalindrome, delay };

