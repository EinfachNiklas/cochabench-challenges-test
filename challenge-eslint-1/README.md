# ESLint Rule Enhancement Challenge

## Background

This challenge is based on a real-world scenario in the ESLint codebase. You're working with the `no-console` rule, which is designed to detect and report usage of `console` methods in JavaScript code.

## The Problem

The current `no-console` rule has a **bug** that causes it to miss console statements when they are **chained with other method calls**.

For example:
```javascript
// Current implementation handles these correctly:
console.log('hello');        // ✓ Detected
console.warn('warning');     // ✓ Detected

// But these edge cases are NOT handled:
console.log('test').toString();    // ✗ BUG: Not detected!
console.error('msg').valueOf();    // ✗ BUG: Not detected!
```

## Your Task

**Fix the bug in the `isMemberAccessExceptAllowed` function** in `challenge/no-console.js` to properly detect console usage even when the console method call is chained with other method calls.

### What's Happening?

When `console.log()` is called and then chained with another method like `.toString()`, the AST (Abstract Syntax Tree) structure looks like this:

```
MemberExpression (.toString)
  └─ CallExpression (console.log())
      └─ MemberExpression (console.log)
          └─ Identifier (console)
```

The current buggy implementation returns `false` (doesn't detect it) when it encounters this chaining pattern. Your job is to fix this!

### Requirements:

1. ✅ All existing tests must still pass (basic console detection)
2. ✅ The 5 failing challenge tests must pass
3. ✅ Don't break the "allowed methods" feature (e.g., `{ allow: ["warn"] }`)
4. ✅ Keep the code maintainable and follow the existing code style

### Files to Modify:

- `challenge/no-console.js` - The main rule implementation (look for the `isMemberAccessExceptAllowed` function around line 93)

### What NOT to Change:

- Don't modify the test files
- Don't modify `ast-utils.js`
- Don't change the overall structure of the rule

## Testing

Run the tests with:
```bash
npm test
```

**Expected Initial State:**
- ❌ 5 tests failing (all in "CHALLENGE: Chained method calls")
- ✅ 11 tests passing (basic functionality)

**Goal:**
- ✅ All 16 tests passing

## Hints

<details>
<summary>💡 Hint 1: Understanding the bug</summary>

The bug is in the `isMemberAccessExceptAllowed` function. Currently, it has this code:

```javascript
if (parent.parent && parent.parent.type === "CallExpression") {
    if (parent.parent.parent && parent.parent.parent.type === "MemberExpression") {
        // This is a chained call like console.log().toString()
        // CHALLENGE: Fix this! Currently returns false, but should return true
        return false;
    }
}
```

The function returns `false` when it detects chaining, but it should return `true` because it's still a console call that should be reported!
</details>

<details>
<summary>💡 Hint 2: The simple fix</summary>

The fix is actually quite simple! The comment says it all - just change that `return false;` to `return true;`.

The logic is: "If we've detected that this is a console method call, and it's being chained, we should STILL report it as a violation!"
</details>

<details>
<summary>💡 Hint 3: Think about the AST traversal</summary>

When you have `console.log().toString()`:
1. `console` is an Identifier
2. `console.log` is a MemberExpression (parent of console)
3. `console.log()` is a CallExpression (parent.parent)
4. `.toString` access makes parent.parent.parent a MemberExpression again

The current code detects this pattern but incorrectly returns `false`. It should return `true` to report the violation.
</details>

## Success Criteria

✅ All 16 tests pass
✅ Code is clean and maintainable
✅ No regressions in existing functionality
✅ Console calls are detected even when chained

## Learning Objectives

By completing this challenge, you will:
- ✨ Understand how ESLint rules work
- ✨ Learn about Abstract Syntax Trees (AST) and how JavaScript code is parsed
- ✨ Practice debugging real-world production code
- ✨ Experience working with a large, established codebase
- ✨ Learn to handle edge cases in code analysis tools

Good luck! 🚀
