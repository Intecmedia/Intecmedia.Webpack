const nodemon = require('nodemon');
const nodemonCli = require('nodemon/lib/cli');
const deepMerge = require('lodash.merge');

const ENV = require('./app.env.js');

const nodemonConfig = {
    delay: '2500',
    ext: 'js,html',
    ignore: [
        '.hg', '.git', '.svn',
        'build', 'node_modules',
        'source/js', 'source/partials', 'source/html.data.js',
    ].concat(ENV.SITEMAP.map(i => i.filename)),
    verbose: true,
};

const options = deepMerge({}, nodemonConfig, nodemonCli.parse(process.argv));

nodemon(options);
