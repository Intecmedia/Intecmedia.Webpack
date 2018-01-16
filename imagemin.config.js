module.expors = {
    svgo: {
        plugins: [
            { removeViewBox: false },
            { removeAttrs: { attrs: 'data\\-.*' } },
        ],
    },
};
