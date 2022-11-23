const path = require('path');
const slash = require('slash');
const weblog = require('webpack-log');
const childProcess = require('child_process');

const logger = weblog({ name: 'fonts-subsets' });

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');

const FONTS_SRC = `${ENV.SOURCE_PATH}/fonts/src-ttf`;
const FONTS_DST = `${ENV.SOURCE_PATH}/fonts`;
const patterns = [...UTILS.processArgs._];

UTILS.globArray(patterns.length > 0 ? patterns : [`${FONTS_SRC}/**/*.ttf`], {
    ignore: [`${ENV.OUTPUT_PATH}/**/*.ttf`],
    nodir: true,
}).then((files) => {
    logger.info(`${files.length} files`);

    const subsetsCommandSuffix = ' --unicodes-file=.fonts-subsets --drop-tables+=FFTM';

    files.forEach((resourcePath) => {
        const source = slash(path.relative(__dirname, resourcePath));
        const target = slash(path.relative(__dirname, path.join(FONTS_DST, path.relative(FONTS_SRC, resourcePath))));

        const basename = path.basename(target, '.ttf');
        const dirname = slash(path.dirname(target));

        logger.info(`${source} --> ${dirname}/${basename}.ttf`);
        childProcess.execSync(`pyftsubset ${source} --output-file=${dirname}/${basename}.ttf ${subsetsCommandSuffix}`, {
            stdio: 'inherit',
        });

        logger.info(`${source} --> ${dirname}/${basename}.woff`);
        childProcess.execSync(
            `pyftsubset ${source} --output-file=${dirname}/${basename}.woff --flavor=woff ${subsetsCommandSuffix}`,
            { stdio: 'inherit' }
        );

        logger.info(`${source} --> ${dirname}/${basename}.woff2`);
        childProcess.execSync(
            `pyftsubset ${source} --output-file=${dirname}/${basename}.woff2 --flavor=woff2 ${subsetsCommandSuffix}`,
            { stdio: 'inherit' }
        );
    });
});
