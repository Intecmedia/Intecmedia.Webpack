module.exports = function helper(message) {
    this.loaderContext.emitError(message);
};
