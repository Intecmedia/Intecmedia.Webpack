const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');
const frontMatter = require('front-matter');
const beautify = require('js-beautify');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const logger = weblog({ name: 'html-beautify' });
const beautifyfIgnore = UTILS.readIgnoreFile('./.jsbeautifyignore');
const statMessages = { fixed: 0, skipped: 0, ignored: 0 };
const patterns = [...UTILS.processArgs._];
const config = UTILS.readJsonFile('./.jsbeautifyrc');

function stripWhitespaces(string) {
    let result = string;

    if (result.charCodeAt(0) === 0xfeff) {
        result = result.slice(1);
    }

    result = result
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '    ')
        .replace(/[ \t]+\n/g, '\n');

    return result;
}

function beautifyHtml(html) {
    let result = beautify.html(html, config);

    result = stripWhitespaces(result);
    result = result.replace(/{{\s*/g, '{{ ').replace(/\s*}}/g, ' }}');
    result = result.replace(/{%(-?)\s*/g, '{%$1 ').replace(/\s*(-?)%}/g, ' $1%}');
    result = result.replace(/{#\s*/g, '{# ').replace(/\s*#}/g, ' #}');

    return result;
}

UTILS.globArray(patterns.length > 0 ? patterns : [`${ENV.SOURCE_PATH}/**/*.html`], {
    ignore: [`${ENV.OUTPUT_PATH}/**/*.html`, `${ENV.SOURCE_PATH}/partials/macros/**/*.html`],
    nodir: true,
}).then((files) => {
    logger.info(`${files.length} files\n`);

    files.forEach((resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        if (beautifyfIgnore.ignores(relativePath)) {
            statMessages.ignored += 1;
            logger.info(`ignored ${relativePath}`);
            return;
        }

        const html = fs.readFileSync(resourcePath).toString('utf-8');
        const templateData = frontMatter(html);

        const output =
            (templateData.frontmatter ? ['---', templateData.frontmatter, '---', ''].join('\n') : '') +
            beautifyHtml(templateData.body.normalize('NFC'));

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
    logger.info('stats:', statMessages);
});
