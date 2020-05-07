/* eslint-env node */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" */

const { Rule } = require('html-validate/build/rule');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((i) => nodeEqual(i, node));

class ImgPictureRequired extends Rule {
    constructor(options) {
        super({ webp: true, ignore: '.wysiwyg img', ...options });
    }

    setup() {
        this.on('dom:ready', (event) => this.domReady(event));
    }

    domReady(event) {
        const imgs = event.document.querySelectorAll('img');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        imgs.forEach((img) => {
            if (nodeIgnore(img, ignores)) {
                return;
            }
            const picture = img.parent;
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
        super({ intrinsicsize: true, ignore: '.wysiwyg img', ...options });
    }

    setup() {
        this.on('dom:ready', (event) => this.domReady(event));
    }

    domReady(event) {
        const imgs = event.document.querySelectorAll('img');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        imgs.forEach((img) => {
            if (nodeIgnore(img, ignores)) {
                return;
            }
            const loading = img.getAttribute('loading');
            if (!loading) {
                this.report(img, '<img> required `loading` attribute.');
            }
            if (this.options.intrinsicsize) {
                const intrinsicsize = img.getAttribute('intrinsicsize');
                if (!intrinsicsize) {
                    this.report(img, '<img> required `intrinsicsize` attribute.');
                }
            }
        });
    }
}

module.exports = { ImgPictureRequired, ImgLoadingRequired };
