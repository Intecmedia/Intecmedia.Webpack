const DATA_URL_PATTERN = /^data:image\//i;

exports.name = 'noDataURL';
exports.description = 'Not allowed data URL(<image xlink:href="data:...">). Please use files instead.';

exports.fn = (root, options, info) => ({
    element: {
        enter: (node) => {
            if (node.name !== 'image') {
                return;
            }
            const isHrefData = DATA_URL_PATTERN.test(node.attributes.href || '');
            const isXlinkData = DATA_URL_PATTERN.test(node.attributes['xlink:href'] || '');
            if (isHrefData || isXlinkData) {
                console.error(`[svgo.no-data-url] error in ${JSON.stringify(info.path)}`, node);
                throw new Error(`In ${JSON.stringify(info.path)} -- ${exports.description}`);
            }
        },
    },
});
