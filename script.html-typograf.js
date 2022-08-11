/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');
const frontMatter = require('front-matter');
const Typograf = require('typograf');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const logger = weblog({ name: 'html-typograf' });

const statMessages = { fixed: 0, skipped: 0 };

const options = require('./.typograf.json');

const instance = new Typograf(options);
instance.addSafeTag('{{', '}}');
instance.addSafeTag('{%', '%}');
instance.addSafeTag('{#', '#}');
instance.addSafeTag('<%', '%>');

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
        ].join('\n') : '') + instance.execute(templateData.body);

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
