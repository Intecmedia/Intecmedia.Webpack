/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');
const frontMatter = require('front-matter');
const beautify = require('js-beautify');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const logger = weblog({ name: 'html-beautify' });

const statMessages = { fixed: 0, skipped: 0 };

const config = require('./.beautifyrc');

const options = {
    ...config,
    templating: 'django',
};

UTILS.glob(`${ENV.SOURCE_PATH}/**/*.html`, {
    ignore: [
        `${ENV.SOURCE_PATH}/**/*.*.html`,
        `${ENV.SOURCE_PATH}/partials/macros/**/*.html`,
    ],
    nodir: true,
}).then((files) => {
    logger.info(`${files.length} files\n`);

    files.forEach((resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        const html = fs.readFileSync(resourcePath).toString('utf-8');
        const templateData = frontMatter(html);

        const output = (templateData.frontmatter ? [
            '---',
            templateData.frontmatter,
            '---',
            '',
        ].join('\n') : '') + beautify.html(templateData.body, options);

        if (html !== output) {
            fs.writeFileSync(resourcePath, output);
            statMessages.fixed += 1;
            logger.info(`fixed ${relativePath}`);
        } else {
            statMessages.skipped += 1;
            logger.info(`skipped ${relativePath}`);
        }
    });

    console.log('');
    logger.info('stats:', JSON.stringify(statMessages));
});
