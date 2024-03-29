const DATA_URL_PATTERN = /^data:image\/[^,;]+(;charset=[^;,]*)?(;base64)?,/;

exports.name = 'noDataURL';
exports.type = 'perItem';
exports.active = true;
exports.description = 'Not allowed data URL(<image xlink:href="data:...">). Please use files instead.';
exports.params = {};

exports.fn = (root, options, extra) => {
    return {
        element: {
            enter: (node) => {
                if (!(node.type === 'element' && node.name === 'image')) return;
                const href = node.attributes['xlink:href'] || node.attributes.href;
                if (href !== undefined && DATA_URL_PATTERN.test(href)) {
                    throw new Error(`In ${JSON.stringify(extra.path)} -- ${exports.description}`);
                }
            },
        },
    };
};
