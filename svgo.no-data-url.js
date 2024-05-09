const DATA_URL_PATTERN = /^data:image\//i;

exports.name = 'noDataURL';
exports.description = 'Not allowed data URL(<image xlink:href="data:...">). Please use files instead.';
exports.active = true;

exports.fn = (root, options, extra) => ({
    element: {
        enter: (node) => {
            if (node.name !== 'image') {
                return;
            }
            const isHrefData = DATA_URL_PATTERN.test(node.attributes.href || '');
            const isXlinkData = DATA_URL_PATTERN.test(node.attributes['xlink:href'] || '');
            if (isHrefData || isXlinkData) {
                console.error(`[svgo.no-data-url] error in ${JSON.stringify(extra.path)}`, node);
                throw new Error(`In ${JSON.stringify(extra.path)} -- ${exports.description}`);
            }
        },
    },
});
