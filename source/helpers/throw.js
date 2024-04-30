/**
 * Emit error message.
 * @param {string} message - error message
 */
function helperThrow(message) {
    this.loaderContext.emitError(message);
}
module.exports = helperThrow;
