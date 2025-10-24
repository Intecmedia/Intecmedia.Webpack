const fs = require('node:fs');
const path = require('node:path');
const weblog = require('webpack-log');

const SVGO = require('svgo');
const { SvgoCreateConfig } = require('./svgo.config');

const logger = weblog({ name: 'svgo' });
const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const VERBOSE = ENV.ARGV.verbose;
const imageminIgnore = UTILS.readIgnoreFile('./.imageminignore');
const statMessages = { fixed: 0, skipped: 0, ignored: 0 };
const patterns = [...UTILS.processArgs._];

const files = UTILS.globArraySync(patterns.length > 0 ? patterns : [`${ENV.SOURCE_PATH}/**/*.svg`], {
    ignore: [`${ENV.OUTPUT_PATH}/**/*.svg`],
    nodir: true,
});

const spritePath = 'img/svg-sprite';

logger.info(`${files.length} files\n`);

files.forEach((resourcePath) => {
    const svg = fs.readFileSync(resourcePath, 'utf8').toString();
    const relativePath = UTILS.slash(path.relative(ENV.SOURCE_PATH, path.normalize(resourcePath)));

    const ignores = imageminIgnore.ignores(relativePath);
    if (ignores) {
        statMessages.ignored += 1;
        if (VERBOSE) {
            logger.info(`ignored ${relativePath}`);
        }
        return;
    }

    const name = path.basename(resourcePath, path.extname(resourcePath));
    const options = SvgoCreateConfig({
        sprite: relativePath.startsWith(spritePath),
        prefix: `svgo-${name.toLowerCase()}`,
        pretty: true,
    });
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
        if (VERBOSE) {
            logger.info(`skipped ${relativePath}`);
        }
    }
});

console.log('');
logger.info('stats:', statMessages);
