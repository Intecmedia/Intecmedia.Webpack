const fs = require('node:fs');
const path = require('node:path');

/**
 * Get lottie-file width and height.
 * @param {string} filename - file path
 * @returns {object} - lottie size
 */
function helperLottieSize(filename) {
    const fullpath = path.join(process.cwd(), 'source', filename);
    this.loaderContext.addDependency(fullpath);
    const lottie = JSON.parse(fs.readFileSync(fullpath));
    return { width: lottie.w, height: lottie.h };
}
module.exports = helperLottieSize;
