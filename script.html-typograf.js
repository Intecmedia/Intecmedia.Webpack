const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');
const frontMatter = require('front-matter');
const Typograf = require('typograf');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const logger = weblog({ name: 'html-typograf' });
const typografIgnore = UTILS.readIgnoreFile('./.typografignore');
const statMessages = { fixed: 0, skipped: 0, ignored: 0 };
const patterns = [...UTILS.processArgs._];
const options = UTILS.readJsonFile('./.typografrc.json');

const instance = new Typograf(options);
instance.addSafeTag('{{', '}}');
instance.addSafeTag('{%', '%}');
instance.addSafeTag('{#', '#}');
instance.addSafeTag('<%', '%>');
instance.addSafeTag('<!--', '-->');
instance.addSafeTag('<!-- typograf ignore:start -->', '<!-- typograf ignore:end -->');

UTILS.globArray(patterns.length > 0 ? patterns : [`${ENV.SOURCE_PATH}/**/*.html`], {
    ignore: [`${ENV.OUTPUT_PATH}/**/*.html`, `${ENV.SOURCE_PATH}/partials/macros/**/*.html`],
    nodir: true,
}).then((files) => {
    logger.info(`${files.length} files\n`);

    files.forEach((resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        if (typografIgnore.ignores(relativePath)) {
            statMessages.ignored += 1;
            logger.info(`ignored ${relativePath}`);
            return;
        }

        const html = fs.readFileSync(resourcePath).toString('utf-8');
        const templateData = frontMatter(html);

        const output =
            (templateData.frontmatter ? ['---', templateData.frontmatter, '---', ''].join('\n') : '') +
            instance.execute(templateData.body);

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
