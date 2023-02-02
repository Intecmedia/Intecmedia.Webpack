module.exports = function helper(size, sources) {
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
};
