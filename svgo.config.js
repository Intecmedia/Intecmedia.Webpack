module.exports = {
    plugins: [
        { cleanupIDs: true },
        { convertShapeToPath: false },
        { removeAttrs: { attrs: 'data\\-.*' } },
        { removeViewBox: false },
    ],
};
