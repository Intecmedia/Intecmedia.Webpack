/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');
const childProcess = require('child_process');

const logger = weblog({ name: 'fonts-subsets' });

const ENV = require('./app.env');

const FONTS_SRC = `${ENV.SOURCE_PATH}/fonts/src-ttf`;
const FONTS_DST = `${ENV.SOURCE_PATH}/fonts`;

if (process.platform === 'win32') {
    childProcess.execSync('chcp 65001');
}

glob(`${FONTS_SRC}/**/*.ttf`, {
    ignore: [],
    nodir: true,
}, (error, files) => {
    if (error) throw error;

    const subsetsCommandSuffix = ' --unicodes-file=.fonts-subsets --drop-tables+=FFTM';

    logger.info(`${files.length} files`);

    files.forEach((resourcePath) => {
        const source = slash(path.relative(__dirname, resourcePath));
        const target = slash(path.relative(__dirname, path.join(FONTS_DST, path.relative(FONTS_SRC, resourcePath))));

        const basename = path.basename(target, '.ttf');
        const dirname = slash(path.dirname(target));

        logger.info(`${source} --> ${dirname}/${basename}.ttf`);
        childProcess.execSync(`pyftsubset ${source} --output-file=${dirname}/${basename}.ttf ${subsetsCommandSuffix}`, { stdio: 'inherit' });

        logger.info(`${source} --> ${dirname}/${basename}.woff`);
        childProcess.execSync(`pyftsubset ${source} --output-file=${dirname}/${basename}.woff --flavor=woff ${subsetsCommandSuffix}`, { stdio: 'inherit' });

        logger.info(`${source} --> ${dirname}/${basename}.woff2`);
        childProcess.execSync(`pyftsubset ${source} --output-file=${dirname}/${basename}.woff2 --flavor=woff2 ${subsetsCommandSuffix}`, { stdio: 'inherit' });
    });
});
