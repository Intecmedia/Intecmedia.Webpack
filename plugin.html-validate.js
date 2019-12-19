/* eslint-env node */

const { Rule } = require('html-validate/build/rule');

class ImgPictureRequired extends Rule {
    setup() {
        this.on('dom:ready', (event) => {
            const imgs = event.document.getElementsByTagName('img');
            imgs.forEach((img) => {
                if (!(img.parent && img.parent.nodeName === 'picture')) {
                    this.report(img, 'img required picture element');
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
