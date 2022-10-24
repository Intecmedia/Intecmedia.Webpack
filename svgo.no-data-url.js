exports.name = 'noDataURL';

exports.type = 'perItem';

exports.active = true;

exports.description = 'Not allowed data URL(<image xlink:href="data:...">). Please use files instead.';

exports.params = {};

const DATA_URL_PATTERN = /^data:image\/[^,;]+(;charset=[^;,]*)?(;base64)?,/;

exports.fn = function noDataURL(item, params, extra) {
    if (!(item.type === 'element' && item.name === 'image')) return;

    const href = item.attr('xlink:href') || item.attr('href');
    if (href !== undefined && DATA_URL_PATTERN.test(href.value)) {
        throw new Error(`In ${JSON.stringify(extra.path)} -- ${exports.description}`);
    }
};
