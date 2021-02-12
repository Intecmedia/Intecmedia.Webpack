/* eslint-env node -- webpack is node env */
/* eslint global-require: "off", "compat/compat": "off" -- webpack is node env */

const path = require('path');
const slash = require('slash');
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
    const { SOURCE_PATH } = require('./app.env.js');
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

function cacheDir(name) {
    const { NODE_ENV } = require('./app.env.js');
    return findCacheDir({ name: `${name}-${NODE_ENV}` });
}

module.exports.cacheDir = cacheDir;
