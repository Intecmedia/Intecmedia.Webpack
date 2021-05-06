/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const gm = require('gm');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const weblog = require('webpack-log');
const { argv } = require('yargs');

const ENV = require('./app.env.js');

const logger = weblog({ name: 'image-lint' });
const imageMagick = gm.subClass({ imageMagick: true });

const IDENTIFY_FORMAT = JSON.stringify({
    format: '%m',
    extension: '%[extension]',
    width: '%[width]',
    height: '%[height]',
    colorspace: '%[colorspace]',
    quality: '%[quality]',
});

async function identifyAsync(filename) {
    const promise = new Promise((resolve, reject) => {
        imageMagick(filename).identify(IDENTIFY_FORMAT, (error, data) => {
            if (error) reject(error);
            else resolve(data);
        });
    });
    const result = JSON.parse(await promise);
    result.width = parseInt(result.width, 10);
    result.height = parseInt(result.height, 10);
    result.quality = parseInt(result.quality, 10);
    if (result.format === 'JPEG') {
        result.format = 'JPG';
    }
    if (result.format === 'MVG' && result.extension.toLowerCase() === 'svg') {
        result.format = 'SVG';
    }
    return result;
}

const LINT_RULES = [
    {
        name: 'size',
        maxwidth: 1920,
        maxheight: 1440,
        fn(identifyData) {
            if (identifyData.width > this.maxwidth || identifyData.height > this.maxheight) {
                return `Image size ${identifyData.width}x${identifyData.height} is not less than ${this.maxwidth}x${this.maxheight}.`;
            }
            return false;
        },
    },
    {
        name: 'format',
        fn(identifyData) {
            if (identifyData.format.toLowerCase() !== identifyData.extension.toLowerCase()) {
                return 'Invalid image format and extension.';
            }
            return false;
        },
    },
    {
        name: 'colorspace',
        allowed: ['sRGB', 'Gray'],
        fn(identifyData) {
            if (!this.allowed.includes(identifyData.colorspace)) {
                return `The color space of this image is ${identifyData.colorspace}. It must be ${JSON.stringify(this.allowed)}.`;
            }
            return false;
        },
    },
];

const verbose = 'verbose' in argv && argv.verbose;
const pathSuffix = argv.pathSuffix && typeof (argv.pathSuffix) === 'string' ? argv.pathSuffix : '';

glob(ENV.SOURCE_PATH + (pathSuffix ? `/${pathSuffix.trim('/')}` : '/**/*.{jpg,jpeg,png,svg,gif}'), {
    ignore: [],
    nodir: true,
}, async (error, files) => {
    if (error) throw error;

    logger.info(`${files.length} files\n`);

    const statMessages = { ignored: 0, skipped: 0 };
    const increaseStat = (type) => {
        if (type in statMessages) statMessages[type] += 1;
        else statMessages[type] = 1;
    };

    const promises = files.map(async (resourcePath) => {
        const relativePath = slash(path.relative(__dirname, resourcePath));
        const identifyData = await identifyAsync(resourcePath);

        const lintErrors = LINT_RULES.map((rule) => {
            const lintError = rule.fn(identifyData);
            return lintError ? [lintError] : [];
        }).flat();

        if (lintErrors.length > 0) {
            logger.info(`${relativePath}: ${JSON.stringify(identifyData)}`);
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

        return identifyData;
    });
    await Promise.all(promises);

    console.log('');
    logger.info('stats:', statMessages);
});
