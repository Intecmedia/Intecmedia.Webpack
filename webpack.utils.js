const fs = require('fs');
const path = require('path');
const slash = require('slash');
const glob = require('glob');
const ignore = require('ignore');
const yargs = require('yargs/yargs');
const findCacheDir = require('find-cache-dir');

const FILENAME_PATTERN = /^[a-zA-Z0-9-/.,_@]+$/;

function lintFilename(filename) {
    if (!FILENAME_PATTERN.test(filename)) {
        throw new Error(
            `Filename ${JSON.stringify(filename)} does not match the naming convention pattern: ${JSON.stringify(
                FILENAME_PATTERN.toString()
            )}`
        );
    }
}

module.exports.lintFilename = lintFilename;

function castScssVar(obj) {
    if (Array.isArray(obj)) {
        return ['(', obj.map((v) => castScssVar(v)).join(', '), ')'].join('');
    }
    if (typeof obj === 'object') {
        return [
            '(',
            Object.entries(obj)
                .map((item) => ((name, value) => `${JSON.stringify(name)}: ${castScssVar(value)}`)(...item))
                .join(', '),
            ')',
        ].join('');
    }
    return JSON.stringify(obj);
}

function toScssVars(obj) {
    return Object.entries(obj)
        .map((item) => ((name, value) => `$${name}: ${castScssVar(value)};`)(...item))
        .join('\n');
}

module.exports.toScssVars = toScssVars;

function resourceName(prefix, hash = false) {
    const ENV = require('./app.env');
    const basename = path.basename(prefix);
    const suffix = hash ? '?[md5:contenthash]' : '';
    return (resourcePath) => {
        const resourceUrl = slash(path.relative(ENV.SOURCE_PATH, resourcePath)).replace(/^(\.\.\/)+/g, '');
        if (ENV.PROD || ENV.DEBUG) {
            lintFilename(resourceUrl);
        }
        if (resourceUrl.startsWith('partials/')) {
            return slash(resourceUrl + suffix);
        }
        if (resourceUrl.startsWith(`${basename}/`)) {
            return slash(resourceUrl + suffix);
        }
        if (resourceUrl.startsWith('node_modules/')) {
            return slash(path.join(basename, resourceUrl.replace(/^node_modules\//, '~') + suffix));
        }
        return slash(path.join(basename, `[name].[ext]${suffix}`));
    };
}

module.exports.resourceName = resourceName;

function cacheDir(name, skipEnv = false) {
    const ENV = require('./app.env');
    const prefixedName = skipEnv ? name : `${name}-${ENV.NODE_ENV}`;
    const orgEnvDir = process.env.CACHE_DIR || null;
    const envDir = slash(path.join(__dirname, 'cache', prefixedName));
    if (fs.existsSync(envDir)) {
        process.env.CACHE_DIR = envDir;
    }
    const result = slash(findCacheDir({ name: prefixedName, create: true }))
        .replace(`${prefixedName}/${prefixedName}`, prefixedName)
        .replace('find-cache-dir', '');
    if (orgEnvDir) {
        process.env.CACHE_DIR = orgEnvDir;
    }
    return result;
}

module.exports.cacheDir = cacheDir;

function globOptions(options) {
    if (options && 'ignore' in options) {
        options.ignore = options.ignore.map(slash);
    }
    return options;
}

module.exports.globOptions = globOptions;

function globArray(patterns, options) {
    return Promise.all(
        patterns.map(
            (pattern) =>
                new Promise((resolve, reject) => {
                    glob.glob(slash(pattern), globOptions(options))
                        .then((files) => resolve(files))
                        .catch((error) => reject(error));
                })
        )
    ).then((files) => files.flat());
}

module.exports.globArray = globArray;

function globArraySync(patterns, options) {
    return patterns.map((pattern) => glob.sync(slash(pattern), globOptions(options))).flat();
}

module.exports.globArraySync = globArraySync;

function globPatched(pattern, options) {
    return new Promise((resolve, reject) => {
        glob.glob(slash(pattern), globOptions(options))
            .then((files) => resolve(files))
            .catch((error) => reject(error));
    });
}

module.exports.glob = globPatched;

function globSyncPatched(pattern, options) {
    return glob.sync(slash(pattern), globOptions(options));
}

module.exports.globSync = globSyncPatched;

function moduleFilenameTemplate(info) {
    const relativePath = slash(path.relative(__dirname, info.absoluteResourcePath));
    return `webpack://${info.namespace}/${relativePath}?${info.query}`;
}

module.exports.moduleFilenameTemplate = moduleFilenameTemplate;

const yargsOptions = {
    'parse-positional-numbers': false,
};

const processArgs = yargs(process.argv.slice(2))
    .parserConfiguration(yargsOptions)
    .option('env', { default: [], type: 'array' })
    .parse();

processArgs.env =
    processArgs.env.length > 0
        ? yargs(processArgs.env.map((i) => `--env.${i}`))
              .parserConfiguration(yargsOptions)
              .option('env', { default: {}, type: 'object' })
              .parse().env
        : {};

module.exports.processArgs = processArgs;

function readJsonFile(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
}

module.exports.readJsonFile = readJsonFile;

function readIgnoreFile(filepath, options = {}) {
    return ignore({
        allowRelativePaths: true,
        ...options,
    }).add(fs.readFileSync(filepath).toString());
}

module.exports.readIgnoreFile = readIgnoreFile;
