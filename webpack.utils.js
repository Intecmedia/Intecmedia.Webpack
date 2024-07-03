const fs = require('node:fs');
const path = require('node:path');
const glob = require('glob');
const ignore = require('ignore');
const yargs = require('yargs/yargs');

const FILENAME_PATTERN = /^[a-zA-Z0-9-/.,_@]+$/;
const MODULES_DIR = path.join(__dirname, 'node_modules');

/**
 * @typedef { import('glob').GlobOptions } GlobOptions
 * @typedef { import('ignore').Options } IgnoreOptions
 * @typedef { import('ignore').Ignore } Ignore
 */

/**
 * Line file name by pattern.
 * @param {string} filename - file name
 */
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

/**
 * Cast object to SCSS variable.
 * @param {object} obj - input object
 * @returns {string} - casted object
 */
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

/**
 * Stringify object to SCSS variable.
 * @param {object} obj - input object
 * @returns {string} - stringify object
 */
function toScssVars(obj) {
    return Object.entries(obj)
        .map((item) => ((name, value) => `$${name}: ${castScssVar(value)};`)(...item))
        .join('\n');
}

module.exports.toScssVars = toScssVars;

/**
 * Fix path slashes.
 * @param {string} filepath - file path
 * @returns {string} - slashed file path
 */
function slash(filepath) {
    const isExtendedLengthPath = filepath.startsWith('\\\\?\\');

    return isExtendedLengthPath ? filepath : filepath.replace(/\\/g, '/');
}

module.exports.slash = slash;

/**
 * Get resource name callback.
 * @param {string} prefix - resource path prefix
 * @param {boolean} hash - use content hash
 * @returns {Function} - resource name callback
 */
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

/**
 * Get cache directory path.
 * @param {string} name - cache name
 * @param {boolean} skipEnv - skip NODE_ENV
 * @returns {string} - cache directory path
 */
function cacheDir(name, skipEnv = false) {
    const ENV = require('./app.env');
    const prefixedName = skipEnv ? name : `${name}-${ENV.NODE_ENV}`;
    if (process.env.CACHE_DIR && !['true', 'false', '1', '0'].includes(process.env.CACHE_DIR)) {
        return slash(path.join(process.env.CACHE_DIR, prefixedName, '/'));
    }

    return slash(path.join(MODULES_DIR, '.cache', prefixedName, '/'));
}

module.exports.cacheDir = cacheDir;

/**
 * Patch glob options.
 * @param {GlobOptions} options - glob options
 * @returns {object} - glob options
 */
function globOptions(options) {
    if (options && 'ignore' in options) {
        options.ignore = options.ignore.map(slash);
    }
    return options;
}

module.exports.globOptions = globOptions;

/**
 * Glob async by array of patterns.
 * @param {Array.string} patterns - glob patterns
 * @param {GlobOptions} options - glob options
 * @returns {Promise} - glob result
 */
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

/**
 * Glob sync by array of patterns.
 * @param {Array.string} patterns - glob patterns
 * @param {GlobOptions} options - glob options
 * @returns {Array} - glob result
 */
function globArraySync(patterns, options) {
    return patterns.map((pattern) => glob.sync(slash(pattern), globOptions(options))).flat();
}

module.exports.globArraySync = globArraySync;

/**
 * Glob with patched options.
 * @param {string} pattern - glob pattern
 * @param {GlobOptions} options - glob options
 * @returns {Promise} - glob result
 */
function globPatched(pattern, options) {
    return new Promise((resolve, reject) => {
        glob.glob(slash(pattern), globOptions(options))
            .then((files) => resolve(files))
            .catch((error) => reject(error));
    });
}

module.exports.glob = globPatched;

/**
 * Glob sync with patched options.
 * @param {string} pattern - glob pattern
 * @param {GlobOptions} options - glob options
 * @returns {Array} - glob result
 */
function globSyncPatched(pattern, options) {
    return glob.sync(slash(pattern), globOptions(options));
}

module.exports.globSync = globSyncPatched;

/**
 * Create webpack module template.
 * @param {object} info - module meta info
 * @returns {string} - webpack module template
 */
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

/**
 * Read and parse json file.
 * @param {string} filepath - json file path
 * @returns {object} - json object
 */
function readJsonFile(filepath) {
    return JSON.parse(fs.readFileSync(filepath));
}

module.exports.readJsonFile = readJsonFile;

/**
 * Read and parse ignore file.
 * @param {string} filepath - ignore file path
 * @param {IgnoreOptions} options - ignore options
 * @returns {Ignore} - ignore object
 */
function readIgnoreFile(filepath, options = {}) {
    return ignore({
        allowRelativePaths: true,
        ...options,
    }).add(fs.readFileSync(filepath).toString());
}

module.exports.readIgnoreFile = readIgnoreFile;

/**
 * Get package name from file.
 * @param {string} filepath - input file path
 * @returns {string} - package name
 */
function packageName(filepath) {
    const relpath = slash(path.relative(MODULES_DIR, path.resolve(filepath)));
    const [org, pkg] = relpath.split('/');

    return org.startsWith('@') ? `${org}/${pkg}` : org;
}

module.exports.packageName = packageName;
