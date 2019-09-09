const path = require('path');
const slash = require('slash');

const ENV = require('./app.env.js');

function castScssReplacer(key, value) {
    if (typeof value === 'object') {
        return value.toString();
    }
    return value;
}

function castScssVar(obj) {
    if (Array.isArray(obj)) {
        return obj.map((v) => JSON.stringify(v, castScssReplacer)).join(', ');
    }
    if (typeof obj === 'object') {
        return [
            '(',
            Object.entries(obj).map((i) => (
                (k, v) => `${JSON.stringify(k, castScssReplacer)}: ${JSON.stringify(v, castScssReplacer)}`
            )(...i)).join(', '),
            ')',
        ].join('');
    }
    return JSON.stringify(obj, castScssReplacer);
}

function toScssVars(obj) {
    return Object.entries(obj).map((i) => ((k, v) => `$${k}: ${castScssVar(v)};`)(...i)).join('\n');
}

module.exports.toScssVars = toScssVars;

function resourceName(prefix, hash = false) {
    const basename = path.basename(prefix);
    const suffix = (hash ? '?[contenthash]' : '');
    return (resourcePath) => {
        const url = slash(path.relative(ENV.SOURCE_PATH, resourcePath)).replace(/^(\.\.\/)+/g, '');
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
