const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const weblog = require('webpack-log');

const ENV = require('./app.env');
const UTILS = require('./webpack.utils');
const config = require('./.imagelintrc');
const imageminConfig = require('./imagemin.config');

const logger = weblog({ name: 'image-lint' });
const lintIgnore = UTILS.readIgnoreFile('./.imagelintignore');

async function metadataAsync(filename) {
    let metadata;
    const result = {};
    try {
        metadata = await sharp(filename).metadata();
    } catch (error) {
        logger.error(filename, error);
        return null;
    }
    const imageStat = await sharp(filename).stats();
    const fileStat = fs.statSync(filename);

    result.isOpaque = imageStat.isOpaque;
    result.hasAlpha = metadata.hasAlpha;
    result.size = fileStat.size;
    result.extension = path.extname(filename).replace('.', '');
    result.width = parseInt(metadata.width, 10);
    result.height = parseInt(metadata.height, 10);
    result.quality = parseInt(metadata.quality, 10);
    result.format = metadata.format === 'jpeg' ? 'jpg' : metadata.format;
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
                return `The color space of this image is ${metadata.space}. It must be ${JSON.stringify(
                    this.allowed
                )}.`;
            }
            return false;
        },
    },
    {
        name: 'jpeg',
        options: { ...imageminConfig.jpeg.options, ...config.jpeg },
        async fn(metadata, filename) {
            if (metadata.format === 'png' && metadata.isOpaque && metadata.hasAlpha) {
                const jpeg = await sharp(filename).jpeg(this.options).toBuffer();
                if (jpeg.length < metadata.size) {
                    const convertSource = UTILS.slash(path.relative(__dirname, filename));
                    const convertTarget = convertSource.replace('.png', '.jpg');
                    return [
                        `JPEG (${jpeg.length} bytes) better than PNG (${metadata.size} bytes).`,
                        `Use JPG instead, please run: \`magick convert ${convertSource} ${convertTarget}\`.`,
                    ].join('\n');
                }
            }
            return false;
        },
    },
    {
        name: 'png',
        options: { ...imageminConfig.png.options, ...config.png },
        async fn(metadata, filename) {
            if (metadata.format === 'jpg') {
                const png = await sharp(filename).png(this.options).toBuffer();
                if (png.length < metadata.size) {
                    const convertSource = UTILS.slash(path.relative(__dirname, filename));
                    const convertTarget = convertSource.replace('.jpg', '.png');
                    return [
                        `PNG (${png.length} bytes) better than JPEG (${metadata.size} bytes).`,
                        `Use PNG instead, please run: \`magick convert ${convertSource} ${convertTarget}\`.`,
                    ].join('\n');
                }
            }
            return false;
        },
    },
];

const patterns = [...UTILS.processArgs._];

const files = UTILS.globArraySync(patterns.length > 0 ? patterns : [`${ENV.SOURCE_PATH}/**/*.{jpg,jpeg,png,svg,gif}`], {
    ignore: [`${ENV.OUTPUT_PATH}/**/*.{jpg,jpeg,png,svg,gif}`],
    nodir: true,
});

logger.info(`${files.length} files\n`);

const statMessages = { ignored: 0, skipped: 0 };
const increaseStat = (type) => {
    if (type in statMessages) statMessages[type] += 1;
    else statMessages[type] = 1;
};

const promises = files.map(async (resourcePath) => {
    const relativePath = UTILS.slash(path.relative(ENV.SOURCE_PATH, resourcePath));

    if (lintIgnore.ignores(relativePath)) {
        increaseStat('ignored');
        logger.info(`${relativePath}: ignored`);
        return Promise.resolve(relativePath);
    }

    const metadata = await metadataAsync(resourcePath);

    if (!metadata) {
        logger.error(`${relativePath}: cannot read metadata`);
        increaseStat('error');
        process.exitCode = 1;
        return Promise.resolve(relativePath);
    }

    const lintErrors = (
        await Promise.all(
            LINT_RULES.map(async (rule) => {
                const lintError = await rule.fn(metadata, resourcePath);
                return lintError ? [lintError] : [];
            })
        )
    ).flat();

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

Promise.all(promises)
    .then(() => {
        console.log('');
        return logger.info('stats:', statMessages);
    })
    .catch((error) => logger.error(error));
