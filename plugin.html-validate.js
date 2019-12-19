/* eslint-env node */
const { Rule } = require('html-validate/build/rule');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);

class ImgPictureRequired extends Rule {
    constructor(options) {
        super({ webp: true, ignore: '.wysiwyg img', ...options });
    }

    setup() {
        this.on('dom:ready', (event) => this.domReady(event));
    }

    domReady(event) {
        const imgs = event.document.getElementsByTagName('img');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        imgs.forEach((img) => {
            if (ignores && ignores.some((i) => nodeEqual(i, img))) {
                return;
            }
            const picture = img.parent;
            if (!(picture && picture.nodeName.toLowerCase() === 'picture')) {
                this.report(img, '<img> required <picture> element.');
                return;
            }
            if (this.options.webp) {
                const sources = picture.querySelectorAll('> source[type="image/webp"]');
                if (!(sources && sources.length)) {
                    this.report(picture, '<picture> required <source type="image/webp"> element.');
                }
            }
        });
    }
}

module.exports = {
    name: 'intecmedia',
    rules: {
        'intecmedia/img-picture-required': ImgPictureRequired,
    },
};
