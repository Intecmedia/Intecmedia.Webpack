/* eslint-env node */
/* eslint "compat/compat": "off" */

const { ImgPictureRequired, ImgLoadingRequired } = require('./plugin.html-validate.img.js');

module.exports = {
    name: 'intecmedia',
    rules: {
        'intecmedia/img-picture-required': ImgPictureRequired,
        'intecmedia/img-loading-required': ImgLoadingRequired,
    },
};
