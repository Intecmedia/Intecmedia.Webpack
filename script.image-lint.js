/* eslint-env node -- webpack is node env */
/* eslint max-len: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const sharp = require('sharp');
const ignore = require('ignore');
const weblog = require('webpack-log');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');
const config = require('./.imagelintrc');

const logger = weblog({ name: 'image-lint' });
const lintIgnore = ignore().add(fs.readFileSync('./.imagelintignore').toString());

async function metadataAsync(filename) {
    const result = {};
    const metadata = await sharp(filename).metadata();
    result.extension = path.extname(filename).replace('.', '');
    result.width = parseInt(metadata.width, 10);
    result.height = parseInt(metadata.height, 10);
    result.quality = parseInt(metadata.quality, 10);
    result.format = (metadata.format === 'jpeg' ? 'jpg' : metadata.format);
    result.space = metadata.space;
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

const patterns = process.argv.slice(2).map((i) => i.trim()).filter((i) => i.length > 0);

UTILS.globArray(patterns.length > 0 ? patterns : [
    `${ENV.SOURCE_PATH}/**/*.{jpg,jpeg,png,svg,gif}`,
], {
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

        if (lintIgnore.ignores(relativePath)) {
            increaseStat('ignored');
            logger.info(`${relativePath}: ignored`);
            return metadata;
        }

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
            logger.info(`skipped ${relativePath}`);
        }

        return metadata;
    });
    await Promise.all(promises);

    console.log('');
    logger.info('stats:', statMessages);
});
