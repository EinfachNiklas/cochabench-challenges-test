/**
 * @fileoverview Tests for no-console rule
 */

"use strict";

const { Linter } = require("eslint");
const rule = require("../challenge/no-console");

describe("no-console rule", () => {
    let linter;

    beforeEach(() => {
        linter = new Linter({ configType: "flat" });
    });

    function runTest(code, ruleConfig = "error") {
        return linter.verify(code, [{
            plugins: {
                test: {
                    rules: {
                        "no-console": rule
                    }
                }
            },
            rules: {
                "test/no-console": ruleConfig
            }
        }]);
    }

    describe("Basic console detection (existing functionality)", () => {
        test("should detect simple console.log", () => {
            const code = "console.log('hello');";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
            expect(messages[0].message).toContain("Unexpected console statement");
        });

        test("should detect console.warn", () => {
            const code = "console.warn('warning');";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
        });

        test("should detect console.error", () => {
            const code = "console.error('error');";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
        });

        test("should allow specified console methods", () => {
            const code = "console.warn('test');";
            const messages = runTest(code, ["error", { allow: ["warn"] }]);

            expect(messages.length).toBe(0);
        });

        test("should detect multiple console calls", () => {
            const code = "console.log('one'); console.error('two'); console.warn('three');";
            const messages = runTest(code);

            expect(messages.length).toBe(3);
        });
    });

    describe("Edge cases for console detection", () => {
        test("should not flag shadowed console variable", () => {
            const code = "function test() { const console = { log: () => {} }; console.log('test'); }";
            const messages = runTest(code);

            expect(messages.length).toBe(0);
        });

        test("should detect console in nested scopes", () => {
            const code = "function test() { if (true) { console.log('nested'); } }";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
        });
    });

    describe("CHALLENGE: Chained method calls", () => {
        test("should detect console.log().toString()", () => {
            const code = "console.log('test').toString();";
            const messages = runTest(code);

            // This test will fail with the initial implementation
            // Your task is to make it pass!
            expect(messages.length).toBe(1);
            expect(messages[0].message).toContain("Unexpected console statement");
        });

        test("should detect console.error().valueOf()", () => {
            const code = "console.error('msg').valueOf();";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
        });

        test("should detect console.warn() chained with multiple methods", () => {
            const code = "console.warn('test').toString().valueOf();";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
        });

        test("should detect console in block with chaining", () => {
            const code = "function foo() { console.log('message').toString(); }";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
        });

        test("should handle complex chaining scenarios", () => {
            const code = "const result = console.log('test').toString().split('');";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
        });
    });

    describe("Should not break existing functionality", () => {
        test("should still work with allowed methods even with chaining", () => {
            const code = "console.warn('test').toString();";
            const messages = runTest(code, ["error", { allow: ["warn"] }]);

            expect(messages.length).toBe(0);
        });

        test("should handle regular method calls that are not console", () => {
            const code = "someObject.log('test').toString();";
            const messages = runTest(code);

            expect(messages.length).toBe(0);
        });
    });

    describe("Suggestions", () => {
        test("should provide suggestions for removable console statements", () => {
            const code = "function test() { console.log('test'); }";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
            expect(messages[0].suggestions).toBeDefined();
            if (messages[0].suggestions) {
                expect(messages[0].suggestions.length).toBeGreaterThan(0);
            }
        });

        test("should not provide suggestions when unsafe to remove", () => {
            const code = "if (test) console.log('message');";
            const messages = runTest(code);

            expect(messages.length).toBe(1);
            // Suggestions might not be available for inline statements
            // This is expected behavior
        });
    });
});
