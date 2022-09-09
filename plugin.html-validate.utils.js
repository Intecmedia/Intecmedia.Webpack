const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((ignore) => nodeEqual(ignore, node));

module.exports = { nodeEqual, nodeIgnore };
