/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');

const realcwd = fs.realpathSync(process.cwd());
if (process.cwd() !== realcwd) {
    throw new Error(`Use real path ${JSON.stringify(realcwd)} instead symlink ${JSON.stringify(process.cwd())}.`);
}

const parsedArgs = require('yargs/yargs')(process.argv.slice(2))
    .option('env', { default: [], type: 'array' }).parse();

const ARGV = Object.fromEntries(parsedArgs.env.map((arg) => {
    const [name, value = true] = arg && arg.split ? arg.split('=', 2) : [arg];
    return [name, value];
}));

const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const DEV_SERVER = ('WEBPACK_DEV_SERVER' in process.env && process.env.WEBPACK_DEV_SERVER === 'true');
const STANDALONE = ['webpack', 'webpack-dev-server'].includes(path.basename(require.main.filename, '.js'));
const WATCH = (process.argv.includes('--watch')) || (process.argv.includes('-w'));
const PROD = (process.env.NODE_ENV === 'production');
const NODE_ENV = PROD ? 'production' : 'development';

const VERBOSE = (NODE_ENV === 'development' || DEBUG);
const SOURCE_MAP = DEBUG || !PROD || DEV_SERVER;

const { name: PACKAGE_NAME, browserslist, config } = require('./package.json');

const SOURCE_PATH = path.resolve(__dirname, 'source');
const OUTPUT_PATH = path.resolve(__dirname, config && config.OUTPUT_PATH ? config.OUTPUT_PATH : 'build');

process.env.DEBUG = DEBUG;
process.env.NODE_ENV = NODE_ENV;

if (!['production', 'development'].includes(NODE_ENV)) {
    throw new Error(`Unknow NODE_ENV=${JSON.stringify(NODE_ENV)}`);
}

const IGNORE_PATTERN = /\/_/;
const SITEMAP = glob.sync(`${slash(SOURCE_PATH)}/**/*.html`, {
    ignore: [
        `${slash(SOURCE_PATH)}/partials/**/*.html`,
        `${slash(SOURCE_PATH)}/upload/**/*.html`,
    ],
}).map((item) => {
    const basename = path.basename(item, '.html');
    const template = slash(path.relative(__dirname, item));
    const underscored = basename.startsWith('_') || IGNORE_PATTERN.test(template);
    const filename = slash(basename === 'index' ? path.join(
        path.relative(SOURCE_PATH, item),
    ) : path.join(
        path.relative(SOURCE_PATH, path.dirname(item)),
        ...(underscored ? [`${basename}.html`] : [basename, 'index.html']),
    ));
    const url = slash(path.dirname(filename)) + (underscored ? '' : path.posix.sep);
    return {
        template,
        filename,
        url: (url === './' ? '' : url),
    };
});

const BANNER_STRING = [
    `[${PACKAGE_NAME}]: ENV.NODE_ENV=${NODE_ENV} | ENV.DEBUG=${DEBUG}`,
    fs.readFileSync(path.join(SOURCE_PATH, 'humans.txt')),
].join('\n\n');

module.exports = {
    ARGV,
    DEBUG,
    DEV_SERVER,
    STANDALONE,
    WATCH,
    PROD,
    NODE_ENV,
    SOURCE_MAP,
    SOURCE_PATH,
    OUTPUT_PATH,
    PACKAGE_NAME,
    BROWSERSLIST: browserslist,
    BROWSERS: DEBUG ? browserslist.production : browserslist[NODE_ENV],
    SITEMAP,
    VERBOSE,
    BANNER_STRING,
};
