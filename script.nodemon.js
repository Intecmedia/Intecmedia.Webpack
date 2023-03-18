const nodemon = require('nodemon');
const nodemonCli = require('nodemon/lib/cli');
const deepMerge = require('lodash.merge');
const weblog = require('webpack-log');

const ENV = require('./app.env');

const logger = weblog({ name: 'nodemon' });

const nodemonConfig = {
    delay: '2500',
    ext: 'js,html',
    watch: ['*.*', '.*'],
    ignore: [
        '**/.hg/**',
        '**/.git/**',
        '**/.svn/**',
        'build',
        'source/js',
        'source/partials',
        'source/html.data.js',
    ].concat(ENV.SITEMAP.map((i) => i.template)),
    verbose: true,
};

const options = deepMerge({}, nodemonConfig, nodemonCli.parse(process.argv));

nodemon(options);

nodemon
    .on('start', () => {
        logger.info('App has started');
    })
    .on('quit', () => {
        logger.warn('App has quit');
        // eslint-disable-next-line no-process-exit -- its ok
        process.exit(0);
    })
    .on('restart', (files) => {
        logger.info('App restarted due to: ', files);
    });

process
    .on('exit', (code) => {
        // Handle normal exits
        nodemon.emit('quit');
        // eslint-disable-next-line no-process-exit -- its ok
        process.exit(code);
    })
    .on('SIGINT', () => {
        // Handle CTRL+C
        nodemon.emit('quit');
        // eslint-disable-next-line no-process-exit -- its ok
        process.exit(0);
    });
