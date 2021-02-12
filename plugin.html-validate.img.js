/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" -- webpack is node env */

const { Rule } = require('html-validate/dist/rule');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((i) => nodeEqual(i, node));

class ImgPictureRequired extends Rule {
    constructor(options) {
        super({ webp: true, ignore: '.wysiwyg img, img.ignore-html-validate', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const imgs = event.document.querySelectorAll('img');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        imgs.forEach((img) => {
            if (nodeIgnore(img, ignores)) {
                return;
            }
            const picture = img.parent;
            const [src] = img.getAttributeValue('src').split('?', 2);
            if (src.endsWith('.svg')) {
                return;
            }
            if (!(picture && picture.nodeName.toLowerCase() === 'picture')) {
                this.report(img, '<img> required <picture> element.');
                return;
            }
            if (this.options.webp) {
                const sources = picture.querySelectorAll('> source[type="image/webp"]');
                if (!(sources && sources.length > 0)) {
                    this.report(picture, '<picture> required <source type="image/webp"> element.');
                }
            }
        });
    }
}

class ImgLoadingRequired extends Rule {
    constructor(options) {
        super({ intrinsicsize: true, ignore: '.wysiwyg img, img.ignore-html-validate', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const imgs = event.document.querySelectorAll('img');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        imgs.forEach((img) => {
            if (nodeIgnore(img, ignores)) {
                return;
            }
            const loading = img.getAttributeValue('loading');
            if (!loading) {
                this.report(img, '<img> required `loading` attribute.');
            }
            if (this.options.intrinsicsize) {
                const intrinsicsize = img.getAttributeValue('intrinsicsize');
                if (!intrinsicsize) {
                    this.report(img, '<img> required `intrinsicsize` attribute.');
                } else if (intrinsicsize.toLowerCase() === 'lazy') {
                    const width = img.getAttributeValue('width');
                    if (!width) {
                        this.report(img, '<img> required `width` attribute.');
                    }
                    const height = img.getAttributeValue('height');
                    if (!height) {
                        this.report(img, '<img> required `height` attribute.');
                    }
                }
            }
        });
    }
}

module.exports = { ImgPictureRequired, ImgLoadingRequired };

module.exports.rules = {
    'pitcher/img-picture-required': ImgPictureRequired,
    'pitcher/img-loading-required': ImgLoadingRequired,
};
