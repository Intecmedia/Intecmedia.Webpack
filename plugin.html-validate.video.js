const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

class VideoPlaysinlineRequired extends Rule {
    constructor(options) {
        super({ ignore: '.wysiwyg video', ...options });
        this.domReady = this.domReady.bind(this);
    }

    setup() {
        this.on('dom:ready', this.domReady);
    }

    domReady({ document }) {
        const videos = document.querySelectorAll('video');
        const ignores = this.options.ignore ? document.querySelectorAll(this.options.ignore) : [];
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
