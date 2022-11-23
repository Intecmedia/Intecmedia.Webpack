const fs = require('fs');
const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');

const SVGO = require('svgo');
const { SvgoCreateConfig } = require('./svgo.config');

const logger = weblog({ name: 'svgo' });
const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const imageminIgnore = UTILS.readIgnoreFile('./.imageminignore');
const statMessages = { fixed: 0, skipped: 0, ignored: 0 };
const patterns = [...UTILS.processArgs._];

UTILS.globArray(patterns.length > 0 ? patterns : [`${ENV.SOURCE_PATH}/**/*.svg`], {
    ignore: [`${ENV.OUTPUT_PATH}/**/*.svg`],
    nodir: true,
}).then((files) => {
    files.forEach((resourcePath) => {
        const svg = fs.readFileSync(resourcePath, 'utf8').toString();
        const relativePath = slash(path.relative(ENV.SOURCE_PATH, path.normalize(resourcePath)));

        const ignores = imageminIgnore.ignores(relativePath);
        if (ignores) {
            statMessages.ignored += 1;
            logger.info(`ignored ${relativePath}`);
            return;
        }

        const name = path.basename(resourcePath, path.extname(resourcePath));
        const options = SvgoCreateConfig({ prefix: `svgo-${name.toLowerCase()}`, pretty: true });
        options.path = relativePath;

        const result = SVGO.optimize(svg, options);
        if (result.error) {
            throw new Error(`${JSON.stringify(relativePath)} -- ${result.error}`);
        } else if (svg !== result.data) {
            fs.writeFileSync(resourcePath, result.data);
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
