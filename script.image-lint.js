/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const path = require('path');
const slash = require('slash');
const sharp = require('sharp');
const weblog = require('webpack-log');
const { argv } = require('yargs');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');
const config = require('./.imagelintrc');

const logger = weblog({ name: 'image-lint' });

async function metadataAsync(filename) {
    const result = await sharp(filename).metadata();
    result.extension = path.extname(filename).replace('.', '');
    result.width = parseInt(result.width, 10);
    result.height = parseInt(result.height, 10);
    result.quality = parseInt(result.quality, 10);
    if (result.format === 'jpeg') {
        result.format = 'jpg';
    }
    delete result.xmp;
    return result;
}

const LINT_RULES = [
    {
        name: 'size',
        maxwidth: config.maxwidth,
        maxheight: config.maxheight,
        fn(metadata) {
            if (metadata.format === 'svg') {
                return false;
            }
            if (metadata.width > this.maxwidth || metadata.height > this.maxheight) {
                return `Image size ${metadata.width}x${metadata.height} is not less than ${this.maxwidth}x${this.maxheight}.`;
            }
            return false;
        },
    },
    {
        name: 'format',
        fn(metadata) {
            if (metadata.format.toLowerCase() !== metadata.extension.toLowerCase()) {
                return 'Invalid image format and extension.';
            }
            return false;
        },
    },
    {
        name: 'space',
        allowed: config.colorspace,
        fn(metadata) {
            if (!this.allowed.includes(metadata.space)) {
                return `The color space of this image is ${metadata.space}. It must be ${JSON.stringify(this.allowed)}.`;
            }
            return false;
        },
    },
];

const verbose = 'verbose' in argv && argv.verbose;
const pathSuffix = argv.pathSuffix && typeof (argv.pathSuffix) === 'string' ? argv.pathSuffix : '';

UTILS.glob(ENV.SOURCE_PATH + (pathSuffix ? `/${pathSuffix.trim('/')}` : '/**/*.{jpg,jpeg,png,svg,gif}'), {
    ignore: [],
    nodir: true,
}).then(async (files) => {
    logger.info(`${files.length} files\n`);

    const statMessages = { ignored: 0, skipped: 0 };
    const increaseStat = (type) => {
        if (type in statMessages) statMessages[type] += 1;
        else statMessages[type] = 1;
    };

    const promises = files.map(async (resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        const metadata = await metadataAsync(resourcePath);

        const lintErrors = LINT_RULES.map((rule) => {
            const lintError = rule.fn(metadata);
            return lintError ? [lintError] : [];
        }).flat();

        if (lintErrors.length > 0) {
            logger.info(`${relativePath}: ${JSON.stringify(metadata)}`);
            lintErrors.forEach((lintError) => {
                logger.error(`${relativePath}: ${lintError}`);
            });
            console.log('');
            increaseStat('error');
            process.exitCode = 1;
        } else {
            increaseStat('skipped');
            if (verbose) logger.info(`skipped ${relativePath}`);
        }

        return metadata;
    });
    await Promise.all(promises);

    console.log('');
    logger.info('stats:', JSON.stringify(statMessages));
});
