module.exports = {
    plugins: [
        { cleanupIDs: false },
        { convertShapeToPath: false },
        { removeAttrs: { attrs: 'data\\-.*' } },
        { removeViewBox: false },
    ],
};
