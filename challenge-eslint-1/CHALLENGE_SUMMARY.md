# ESLint Brown Field Challenge - Summary

## ✅ Challenge Successfully Created!

### Challenge Details

**Name:** ESLint Rule Enhancement Challenge
**ID:** challenge-eslint-1
**Type:** Brown Field JavaScript Challenge
**Difficulty:** Medium
**Source:** Based on ESLint's `no-console` rule

### What Was Created

1. **Challenge Structure**
   - [challenge-eslint-1/challenge/no-console.js](challenge-eslint-1/challenge/no-console.js) - Main rule implementation with intentional limitation
   - [challenge-eslint-1/challenge/ast-utils.js](challenge-eslint-1/challenge/ast-utils.js) - Simplified AST utilities
   - [challenge-eslint-1/test/no-console.test.js](challenge-eslint-1/test/no-console.test.js) - Comprehensive test suite

2. **Documentation**
   - [challenge-eslint-1/README.md](challenge-eslint-1/README.md) - Challenge description and requirements
   - [challenge-eslint-1/CHALLENGE_NOTICE.md](challenge-eslint-1/CHALLENGE_NOTICE.md) - Attribution and source information
   - [challenge-eslint-1/challenge.config.json](challenge-eslint-1/challenge.config.json) - Challenge configuration

3. **Configuration**
   - [challenge-eslint-1/package.json](challenge-eslint-1/package.json) - Dependencies and scripts
   - [challenge-eslint-1/jest.config.js](challenge-eslint-1/jest.config.js) - Jest configuration
   - [challenge-eslint-1/.gitignore](challenge-eslint-1/.gitignore) - Git ignore rules

### The Challenge

Participants need to enhance the `canProvideSuggestions` function in the `no-console` rule to properly detect console usage even when chained with other method calls.

**Current Limitation:**
```javascript
// These are detected correctly:
console.log('hello');      // ✓ Detected
console.warn('warning');   // ✓ Detected

// These are NOT detected (Challenge!):
console.log('test').toString();    // ✗ Should be detected
console.error('msg').valueOf();    // ✗ Should be detected
```

### Test Results

**Current State:** ❌ 5 tests failing, ✅ 11 tests passing

**Failing Tests (Expected):**
- ❌ should detect console.log().toString()
- ❌ should detect console.error().valueOf()
- ❌ should detect console.warn() chained with multiple methods
- ❌ should detect console in block with chaining
- ❌ should handle complex chaining scenarios

**Passing Tests:**
- ✅ All basic console detection tests (5)
- ✅ Edge case tests (2)
- ✅ Existing functionality tests (2)
- ✅ Suggestion tests (2)

**Note:** The challenge now has an intentional bug that causes it to miss chained console calls. Participants need to fix this bug to make all tests pass.

### What Makes This a Good Brown Field Challenge

✅ **Real-world code** - Based on actual ESLint source
✅ **Complex domain** - AST manipulation and tree traversal
✅ **Existing patterns** - Must maintain consistency
✅ **Edge cases** - Real production edge cases
✅ **Complete tests** - Comprehensive test coverage
✅ **Documentation** - Well-documented code

### Next Steps

1. **Test the challenge:** `cd challenge-eslint-1 && npm test`
2. **Optional: Add intentional bug** - If you want to make it harder, introduce a bug in `canProvideSuggestions`
3. **Add to release workflow** - Update `.github/workflows/release.yml` to include this challenge
4. **Commit and push**

### Commands

```bash
# Install dependencies
cd challenge-eslint-1 && npm install

# Run tests
npm test

# View challenge
cat README.md
```

### Files Modified

- [manifest.json](manifest.json) - Added challenge-eslint-1 entry

---

**Challenge Type:** Brownfield
**Source Project:** ESLint
**License:** MIT
**Created:** 2026-02-26
