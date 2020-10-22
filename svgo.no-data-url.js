/* eslint-env node */
/* eslint "compat/compat": "off" */

exports.type = 'perItem';

exports.active = false;

exports.description = 'Not allowed data URL(<image xlink:href="data:...">). Please use files instead.';

exports.params = {};

const DATA_URL_PATTERN = /^data:image\/[^,;]+(;charset=[^;,]*)?(;base64)?,/;

exports.fn = function noDataURL(item) {
    if (item.isElem('image')) {
        const href = item.attr('xlink:href') || item.attr('href');
        if (href !== undefined && DATA_URL_PATTERN.test(href.value)) {
            throw new Error(exports.description);
        }
    }
};
