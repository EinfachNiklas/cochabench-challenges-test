const test = require("node:test");
const assert = require("node:assert/strict");
const { mergeIntervals } = require("../challenge/index.js");

test("merges overlapping intervals (basic)", () => {
	const input = [
		[1, 3],
		[2, 6],
		[8, 10],
		[15, 18],
	];
	const out = mergeIntervals(input);
	assert.deepEqual(out, [
		[1, 6],
		[8, 10],
		[15, 18],
	]);
});

test("merges touching intervals (end == nextStart)", () => {
	const input = [
		[1, 2],
		[2, 3],
		[5, 7],
		[7, 8],
	];
	const out = mergeIntervals(input);
	assert.deepEqual(out, [
		[1, 3],
		[5, 8],
	]);
});

test("handles unsorted input", () => {
	const input = [
		[8, 10],
		[1, 3],
		[2, 6],
		[15, 18],
	];
	const out = mergeIntervals(input);
	assert.deepEqual(out, [
		[1, 6],
		[8, 10],
		[15, 18],
	]);
});

test("returns empty array for empty input", () => {
	assert.deepEqual(mergeIntervals([]), []);
});

test("single interval stays unchanged", () => {
	assert.deepEqual(mergeIntervals([[4, 9]]), [[4, 9]]);
});

test("supports negative numbers", () => {
	const input = [
		[-10, -5],
		[-6, -1],
		[0, 2],
	];
	const out = mergeIntervals(input);
	assert.deepEqual(out, [
		[-10, -1],
		[0, 2],
	]);
});

test("does not mutate the input array", () => {
	const input = [
		[3, 4],
		[1, 2],
		[2, 3],
	];
	const before = JSON.stringify(input);
	mergeIntervals(input);
	const after = JSON.stringify(input);
	assert.equal(after, before);
});

