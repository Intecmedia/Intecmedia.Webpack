/**
 * Filter image sources via image size
 * @param {object} size - image size
 * @param {Array} sources - image sources
 * @returns {Array} - filtered image sources
 */
function helperImageSources(size, sources) {
    if (!(size.width && size.height)) {
        return [];
    }

    return sources.filter((source) => {
        const resizeMatch = (source[1] || '').trim().match(/^(\d*)(x(\d*))?(\w+)?$/) || [];
        const resizeWidth = parseInt(resizeMatch[1], 10);
        const resizeHeight = parseInt(resizeMatch[2], 10);
        if (resizeWidth > 0 && resizeWidth >= size.width) {
            return false;
        }
        if (resizeHeight > 0 && resizeHeight >= size.height) {
            return false;
        }

        return true;
    });
}

module.exports = helperImageSources;
