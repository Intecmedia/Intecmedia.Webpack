const path = require('path');

const DEBUG = ('DEBUG' in process.env && parseInt(process.env.DEBUG, 10) > 0);
const DEV_SERVER = path.basename(require.main.filename, '.js') === 'webpack-dev-server';
const STANDALONE = ['webpack', 'webpack-dev-server'].includes(path.basename(require.main.filename, '.js'));
const WATCH = (process.argv.indexOf('--watch') !== -1) || (process.argv.indexOf('-w') !== -1);
const PROD = (process.env.NODE_ENV === 'production');
const NODE_ENV = PROD ? 'production' : 'development';
const USE_SOURCE_MAP = (DEBUG && !PROD) || DEV_SERVER;
const USE_LINTERS = PROD || DEBUG;

const { name: PACKAGE_NAME, browserslist: BROWSERS } = require('./package.json');

const SOURCE_PATH = path.resolve(__dirname, 'source');
const OUTPUT_PATH = path.resolve(__dirname, 'build');

process.env.DEBUG = DEBUG;
process.env.NODE_ENV = NODE_ENV;

if (!['production', 'development'].includes(NODE_ENV)) {
    throw new Error(`Unknow NODE_ENV=${JSON.stringify(NODE_ENV)}`);
}

if (PROD && DEBUG) {
    throw new Error(`Dont use ENV.NODE_ENV=${NODE_ENV} and ENV.DEBUG=${DEBUG} together`);
}

module.exports = {
    DEBUG,
    DEV_SERVER,
    STANDALONE,
    WATCH,
    PROD,
    NODE_ENV,
    USE_SOURCE_MAP,
    USE_LINTERS,
    SOURCE_PATH,
    OUTPUT_PATH,
    PACKAGE_NAME,
    BROWSERS,
};
