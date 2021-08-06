/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const slash = require('slash');
const glob = require('glob');
const findCacheDir = require('find-cache-dir');

function castScssVar(obj) {
    if (Array.isArray(obj)) {
        return [
            '(',
            obj.map((v) => castScssVar(v)).join(', '),
            ')',
        ].join('');
    }
    if (typeof obj === 'object') {
        return [
            '(',
            Object.entries(obj).map((i) => (
                (k, v) => `${JSON.stringify(k)}: ${castScssVar(v)}`
            )(...i)).join(', '),
            ')',
        ].join('');
    }
    return JSON.stringify(obj);
}

function toScssVars(obj) {
    return Object.entries(obj).map((i) => ((k, v) => `$${k}: ${castScssVar(v)};`)(...i)).join('\n');
}

module.exports.toScssVars = toScssVars;

function resourceName(prefix, hash = false) {
    const basename = path.basename(prefix);
    const suffix = (hash ? '?[md5:contenthash]' : '');
    const { SOURCE_PATH } = require('./app.env');
    return (resourcePath) => {
        const url = slash(path.relative(SOURCE_PATH, resourcePath)).replace(/^(\.\.\/)+/g, '');
        if (url.startsWith('partials/')) {
            return slash(url + suffix);
        }
        if (url.startsWith(`${basename}/`)) {
            return slash(url + suffix);
        }
        if (url.startsWith('node_modules/')) {
            return slash(path.join(basename, url + suffix));
        }
        return slash(path.join(basename, `[name].[ext]${suffix}`));
    };
}

module.exports.resourceName = resourceName;

function cacheDir(name, skipEnv = false) {
    const { NODE_ENV } = require('./app.env');
    const prefixedName = (skipEnv ? name : `${name}-${NODE_ENV}`);
    const orgEnvDir = process.env.CACHE_DIR || null;
    const envDir = path.join(__dirname, 'cache', prefixedName);
    if (fs.existsSync(envDir)) {
        process.env.CACHE_DIR = envDir;
    }
    const result = findCacheDir({ name: prefixedName, create: true }).replace('find-cache-dir', '');
    if (orgEnvDir) {
        process.env.CACHE_DIR = orgEnvDir;
    }
    return result;
}

module.exports.cacheDir = cacheDir;

function globArray(patterns, options) {
    return Promise.all(patterns.map((pattern) => (new Promise((resolve, reject) => {
        glob(pattern, options, (error, files) => (error === null ? resolve(files) : reject(error)));
    })))).then((files) => files.flat());
}

module.exports.globArray = globArray;

function globArraySync(patterns, options) {
    return patterns.map((pattern) => glob.sync(pattern, options)).flat();
}

module.exports.globArraySync = globArraySync;

function moduleFilenameTemplate(info) {
    const relativePath = slash(path.relative(__dirname, info.absoluteResourcePath));
    return `webpack://${info.namespace}/${relativePath}?${info.query}`;
}

module.exports.moduleFilenameTemplate = moduleFilenameTemplate;
