/**
 * @fileoverview Simplified AST utilities for the no-console challenge
 * This is a minimal version containing only the functions needed for the challenge
 */

"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * A set of node types that can contain a list of statements
 * @type {Set<string>}
 */
const STATEMENT_LIST_PARENTS = new Set([
    "Program",
    "BlockStatement",
    "StaticBlock",
    "SwitchCase"
]);

/**
 * Gets the property name of a given node.
 * The node can be a MemberExpression, a Property, or a MethodDefinition.
 *
 * If the name is dynamic, this returns `null`.
 *
 * For examples:
 *
 *     a.b           // => "b"
 *     a["b"]        // => "b"
 *     a['b']        // => "b"
 *     a[`b`]        // => "b"
 *     a[100]        // => "100"
 *     a[b]          // => null
 *     a["a" + "b"]  // => null
 *     a[tag`b`]     // => null
 *     a[`${b}`]     // => null
 *
 *     let a = {b: 1}            // => "b"
 *     let a = {["b"]: 1}        // => "b"
 *     let a = {[`b`]: 1}        // => "b"
 *     let a = {[100]: 1}        // => "100"
 *     let a = {[b]: 1}          // => null
 *     let a = {["a" + "b"]: 1}  // => null
 *     let a = {[tag`b`]: 1}     // => null
 *     let a = {[`${b}`]: 1}     // => null
 * @param {ASTNode} node The node to get.
 * @returns {string|null} The property name if static. Otherwise, null.
 */
function getStaticPropertyName(node) {
    let prop;

    if (node) {
        switch (node.type) {
            case "ChainExpression":
                return getStaticPropertyName(node.expression);

            case "Property":
            case "PropertyDefinition":
            case "MethodDefinition":
                prop = node.key;
                break;

            case "MemberExpression":
                prop = node.property;
                break;

            // no default
        }
    }

    if (prop) {
        if (prop.type === "Identifier" && !node.computed) {
            return prop.name;
        }

        return getStaticStringValue(prop);
    }

    return null;
}

/**
 * Gets the string value of a given node.
 * This function is for `Literal` and `TemplateLiteral` nodes.
 * If the node is not a string literal, this returns `null`.
 * @param {ASTNode} node The node to get.
 * @returns {string|null} The string value if exists. Otherwise, null.
 */
function getStaticStringValue(node) {
    switch (node.type) {
        case "Literal":
            if (typeof node.value === "string") {
                return node.value;
            }
            break;

        case "TemplateLiteral":
            if (node.expressions.length === 0 && node.quasis.length === 1) {
                return node.quasis[0].value.cooked;
            }
            break;

        // no default
    }

    return null;
}

/**
 * Gets a variable by its name from a given scope.
 * @param {Scope} initScope The scope to start searching.
 * @param {string} name The variable name to find.
 * @returns {Variable|null} The found variable or null.
 */
function getVariableByName(initScope, name) {
    let scope = initScope;

    while (scope) {
        const variable = scope.set.get(name);

        if (variable) {
            return variable;
        }

        scope = scope.upper;
    }

    return null;
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = {
    STATEMENT_LIST_PARENTS,
    getStaticPropertyName,
    getVariableByName
};
