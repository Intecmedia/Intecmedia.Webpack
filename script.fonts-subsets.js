const path = require('node:path');
const weblog = require('webpack-log');
const childProcess = require('node:child_process');

const logger = weblog({ name: 'fonts-subsets' });

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const FONTS_SRC = `${ENV.SOURCE_PATH}/fonts/src-ttf`;
const FONTS_DST = `${ENV.SOURCE_PATH}/fonts`;
const patterns = [...UTILS.processArgs._];

const files = UTILS.globArraySync(patterns.length > 0 ? patterns : [`${FONTS_SRC}/**/*.ttf`], {
    ignore: [`${ENV.OUTPUT_PATH}/**/*.ttf`],
    nodir: true,
});

logger.info(`${files.length} files`);

const commandPrefix = 'pyftsubset';
const commandSuffix = ' --unicodes-file=.fonts-subsets --drop-tables+=FFTM';

files.forEach((resourcePath) => {
    const source = UTILS.slash(path.relative(__dirname, resourcePath));
    const target = UTILS.slash(path.relative(__dirname, path.join(FONTS_DST, path.relative(FONTS_SRC, resourcePath))));

    const basename = path.basename(target, '.ttf');
    const dirname = UTILS.slash(path.dirname(target));

    logger.info(`${source} --> ${dirname}/${basename}.ttf`);
    childProcess.execSync(`${commandPrefix} ${source} --output-file=${dirname}/${basename}.ttf ${commandSuffix}`, {
        stdio: 'inherit',
    });

    logger.info(`${source} --> ${dirname}/${basename}.woff`);
    childProcess.execSync(`${commandPrefix} ${source} --output-file=${dirname}/${basename}.woff --flavor=woff ${commandSuffix}`, { stdio: 'inherit' });

    logger.info(`${source} --> ${dirname}/${basename}.woff2`);
    childProcess.execSync(`${commandPrefix} ${source} --output-file=${dirname}/${basename}.woff2 --flavor=woff2 ${commandSuffix}`, { stdio: 'inherit' });
});
