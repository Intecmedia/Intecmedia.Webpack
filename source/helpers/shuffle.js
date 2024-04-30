/**
 * Randomize array.
 * @param {Array} arr - input array
 * @returns {Array} - randomized array
 */
function helperShuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
module.exports = helperShuffle;
