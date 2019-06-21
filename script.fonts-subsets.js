/* eslint max-len: "off" */
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');
const childProcess = require('child_process');

const logger = weblog({ name: 'fonts-subsets' });

const ENV = require('./app.env.js');

const FONTS_SRC = `${ENV.SOURCE_PATH}/fonts/src-ttf`;
const FONTS_DST = `${ENV.SOURCE_PATH}/fonts`;

glob(`${FONTS_SRC}/**/*.ttf`, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const source = slash(path.relative(__dirname, filename));
        const target = slash(path.relative(__dirname, path.join(FONTS_DST, path.relative(FONTS_SRC, filename))));

        const basename = path.basename(target, '.ttf');
        const dirname = slash(path.dirname(target));

        logger.info(`${source} --> ${dirname}/${basename}.ttf`);
        childProcess.execSync(`pyftsubset ${source} --output-file=${dirname}/${basename}.ttf --unicodes-file=fonts-subsets.txt`, { stdio: 'inherit' });

        logger.info(`${source} --> ${dirname}/${basename}.woff`);
        childProcess.execSync(`pyftsubset ${source} --output-file=${dirname}/${basename}.woff --flavor=woff --unicodes-file=fonts-subsets.txt`, { stdio: 'inherit' });

        logger.info(`${source} --> ${dirname}/${basename}.woff2`);
        childProcess.execSync(`pyftsubset ${source} --output-file=${dirname}/${basename}.woff2 --flavor=woff2 --unicodes-file=fonts-subsets.txt`, { stdio: 'inherit' });
    });
});
