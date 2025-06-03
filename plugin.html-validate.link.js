const { Rule } = require('html-validate');
const { nodeIgnore } = require('./plugin.html-validate.utils');

const ENV = require('./app.env');

/**
 * @typedef { import('html-validate').DOMReadyEvent } DOMReadyEvent
 */

/**
 * Lint empty `a[href]` attribute.
 */
class LinkNoEmpty extends Rule {
    /**
     * @param {object} options - plugin options
     */
    constructor(options) {
        super({ ignore: '.wysiwyg a', ...options });
        this.domReady = this.domReady.bind(this);
    }

    /**
     * Setup plugin events.
     */
    setup() {
        this.on('dom:ready', this.domReady);
    }

    /**
     * Lint `a[href]` nodes.
     * @param {DOMReadyEvent.document} document - document object
     */
    domReady({ document }) {
        const links = document.querySelectorAll('a');
        const ignores = this.options.ignore ? document.querySelectorAll(this.options.ignore) : [];

        links.forEach((item) => {
            if (nodeIgnore(item, ignores)) {
                return;
            }
            const href = String(item.getAttributeValue('href') || '');
            if (href === '') {
                this.report(item, '<a> required `href` attribute.');
            } else if (href === '#') {
                this.report(item, '<a> required `href` attribute.');
            } else if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (!target) {
                    this.report(item, `<a> not found target node (\`href=${JSON.stringify(href)}\`).`);
                }
            }
        });
    }
}

/**
 * Lint trailing `a[href]` attribute.
 */
class LinkTrailingSlash extends Rule {
    sitemapUrls = [];

    /**
     * @param {object} options - plugin options
     */
    constructor(options) {
        super({ ignore: '.wysiwyg a', ...options });
        this.domReady = this.domReady.bind(this);
    }

    /**
     * Setup plugin events.
     */
    setup() {
        this.on('dom:ready', this.domReady);
        this.sitemapUrls = ENV.SITEMAP.map((i) => i.PAGE.URL);
    }

    /**
     * Lint `a[href]` nodes.
     * @param {DOMReadyEvent.document} document - document object
     */
    domReady({ document }) {
        const links = document.querySelectorAll('a');
        const ignores = this.options.ignore ? document.querySelectorAll(this.options.ignore) : [];

        links.forEach((item) => {
            if (nodeIgnore(item, ignores)) {
                return;
            }
            const href = String(item.getAttributeValue('href') || '');
            if (href.charAt(0) === '/' && href.charAt(1) !== '/') {
                const url = new URL(href, 'https://localhost/');
                if (!url.pathname.endsWith('/') && this.sitemapUrls.includes(`${url.pathname}/`)) {
                    this.report(item, `<a> trailing slash required (\`href=${JSON.stringify(href)}\`).`);
                }
            }
        });
    }
}

module.exports = { LinkNoEmpty, LinkTrailingSlash };

module.exports.rules = {
    'pitcher/link-no-empty': LinkNoEmpty,
    'pitcher/link-trailing-slash': LinkTrailingSlash,
};
