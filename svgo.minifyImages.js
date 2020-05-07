/* eslint-env node */
/* eslint "compat/compat": "off" */

const imagemin = require('imagemin');
const imageminOptions = require('./imagemin.config.js');

const base64Regexp = new RegExp(/data:image\/([a-zA-Z]*);base64,([^"]*)/);

const plugin = {
    type: 'perItem',
    active: true,
    description: 'minifies PNG, GIF and JPG images',
    params: {
        imageminOptions,
    },
    async fn(item, options) {
        if (item.isElem('image') && item.hasAttrLocal('href', base64Regexp)) {
            const originalImage = item.attrs['xlink:href'].value;
            const [, imageType, base64data] = base64Regexp.exec(originalImage);

            const bufferedImage = Buffer.from(base64data, 'base64');
            const imageminResult = await imagemin.buffer(bufferedImage, options.imageminOptions);

            item.attrs['xlink:href'].value = `data:image/${imageType};base64,${imageminResult.toString('base64')}`;
        }
    },
};


export default plugin;
