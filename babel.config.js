const ENV = require('./app.env.js');

module.exports = {
    plugins: [
        '@babel/transform-runtime',
    ],
    presets: [
        ['@babel/preset-env', {
            modules: 'commonjs',
            useBuiltIns: 'entry',
            targets: { browsers: ENV.BROWSERS },
        }],
        ['airbnb', {
            modules: true,
            targets: { browsers: ENV.BROWSERS },
        }],
    ],
};
