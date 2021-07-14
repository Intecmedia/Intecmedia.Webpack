/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" -- webpack is node env */

const { Rule } = require('html-validate');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((i) => nodeEqual(i, node));

class ImgPictureRequired extends Rule {
    constructor(options) {
        super({
            webp: true, avif: false, ignore: '.wysiwyg img, img.ignore-html-validate', ...options,
        });
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
            const sourcesWebp = picture ? picture.querySelectorAll('> source[type="image/webp"]') : [];
            const sourcesAvif = picture ? picture.querySelectorAll('> source[type="image/avif"]') : [];

            if (src.endsWith('.svg')) {
                if (!(sourcesWebp && sourcesWebp.length > 0)) {
                    this.report(picture, `<img src="${src}">: <picture> contains useless <source type="image/webp"> element.`);
                }
                if (!(sourcesAvif && sourcesAvif.length > 0)) {
                    this.report(picture, `<img src="${src}">: <picture> contains useless <source type="image/avif"> element.`);
                }
                return;
            }
            if (!(picture && picture.nodeName.toLowerCase() === 'picture')) {
                this.report(img, `<img src="${src}">: <img> required <picture> element.`);
                return;
            }
            if (this.options.webp) {
                if (!(sourcesWebp && sourcesWebp.length > 0)) {
                    this.report(picture, `<img src="${src}">: <picture> required <source type="image/webp"> element.`);
                }
            }
            if (this.options.avif) {
                if (!(sourcesAvif && sourcesAvif.length > 0)) {
                    this.report(picture, `<img src="${src}">: <picture> required <source type="image/avif"> element.`);
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
