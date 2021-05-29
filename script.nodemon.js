/* eslint-env node -- webpack is node env */
/* eslint "compat/compat": "off" -- webpack is node env */

const nodemon = require('nodemon');
const nodemonCli = require('nodemon/lib/cli');
const deepMerge = require('lodash.merge');
const weblog = require('webpack-log');

const ENV = require('./app.env');

const logger = weblog({ name: 'nodemon' });

const nodemonConfig = {
    delay: '2500',
    ext: 'js,html',
    ignore: [
        '**/.hg/**', '**/.git/**', '**/.svn/**',
        'build', 'source/js', 'source/partials', 'source/html.data.js',
    ].concat(ENV.SITEMAP.map((i) => i.template)),
    verbose: true,
};

const options = deepMerge({}, nodemonConfig, nodemonCli.parse(process.argv));

nodemon(options);

nodemon.on('start', () => {
    logger.info('App has started');
}).on('quit', () => {
    logger.warn('App has quit');
    process.exit();
}).on('restart', (files) => {
    logger.info('App restarted due to: ', files);
});
