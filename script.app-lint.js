const weblog = require('webpack-log');

const logger = weblog({ name: 'app-lint' });
const APP = require('./app.config.js');
const PACKAGE = require('./package.json');

const lintWarns = [];
const lintErrors = [];

if (PACKAGE.name === 'Intecmedia.Webpack') {
    lintErrors.push('rename `name` in `package.json`');
}

if (APP.TITLE === '$APP.TITLE$' || APP.TITLE.trim() === '') {
    lintErrors.push('rename `TITLE` in `app.config.js`');
} else if (APP.TITLE.trim() === '') {
    lintErrors.push('empty `TITLE` in `app.config.js`');
}

if (APP.SHORT_NAME === '$APP.SHORT_NAME$' || APP.SHORT_NAME.trim() === '') {
    lintErrors.push('rename `SHORT_NAME` in `app.config.js`');
} else if (APP.SHORT_NAME.trim() === '') {
    lintErrors.push('empty `SHORT_NAME` in `app.config.js`');
}

if (APP.DESCRIPTION === '$APP.DESCRIPTION$') {
    lintErrors.push('rename `DESCRIPTION in `app.config.js`');
} else if (APP.DESCRIPTION.trim() === '') {
    lintWarns.push('empty `DESCRIPTION` in `app.config.js`');
}

lintWarns.map(i => logger.warn(i));
lintErrors.map(i => logger.error(i));

logger.info(`errors: ${lintErrors.length} warnings: ${lintWarns.length}`);

if (lintErrors.length > 0) {
    process.exit(1);
}
