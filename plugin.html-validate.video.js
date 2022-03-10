/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off", "max-classes-per-file": "off" -- webpack is node env */

const { Rule } = require('html-validate');

const nodeEqual = (a, b) => JSON.stringify(a.location) === JSON.stringify(b.location);
const nodeIgnore = (node, ignores) => ignores && ignores.some((ignore) => nodeEqual(ignore, node));

class VideoPlaysinlineRequired extends Rule {
    constructor(options) {
        super({ ignore: '.wysiwyg video', ...options });
    }

    setup() {
        this.on('dom:ready', this.domReady.bind(this));
    }

    domReady(event) {
        const videos = event.document.querySelectorAll('video');
        const ignores = this.options.ignore ? event.document.querySelectorAll(this.options.ignore) : [];
        videos.forEach((video) => {
            if (nodeIgnore(video, ignores)) {
                return;
            }
            const autoplay = video.hasAttribute('autoplay');
            const playsinline = video.hasAttribute('playsinline');
            if (autoplay && !playsinline) {
                this.report(video, '<video> required `playsinline` attribute with `autoplay` attribute.');
            }
        });
    }
}

module.exports = { VideoPlaysinlineRequired };

module.exports.rules = {
    'pitcher/video-playsinline-required': VideoPlaysinlineRequired,
};
