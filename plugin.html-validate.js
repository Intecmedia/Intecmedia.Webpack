/* eslint-env node */
const { Rule } = require('html-validate/build/rule');

class ImgPictureRequired extends Rule {
    constructor(options) {
        super({ webp: true, ...options });
    }

    setup() {
        this.on('dom:ready', (event) => {
            const imgs = event.document.getElementsByTagName('img');
            imgs.forEach((img) => {
                const picture = img.parent;
                if (!(picture && picture.nodeName.toLowerCase() === 'picture')) {
                    this.report(img, '<img> required <picture> element.');
                    return;
                }
                if (this.options.webp) {
                    const sources = picture.querySelectorAll('source[type="image/webp"]');
                    if (!(sources && sources.length)) {
                        this.report(picture, '<picture> required <source type="image/webp"> element.');
                    }
                }
            });
        });
    }
}

module.exports = {
    name: 'intecmedia',
    rules: {
        'intecmedia/img-picture-required': ImgPictureRequired,
    },
};
