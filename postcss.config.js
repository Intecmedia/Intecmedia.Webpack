const browserslist = require("browserslist");
const PROD = process.argv.indexOf("-p") !== -1;

const browsers = browserslist.readConfig("./.browserslistrc").defaults;


module.exports = {
    sourceMap: !PROD,
    plugins: [
        require("stylelint")({
        }),
        require("postcss-focus")(),
        require("pixrem")({
            rootValue: 16,
            browsers: browsers,
            unitPrecision: 3,
        }),
        require("css-mqpacker")({
            sort: true,
        }),
        require("autoprefixer")({
            browsers: browsers,
            add: true,
        }),
        require("cssnano")({
            discardComments: { removeAll: true },
        }),
    ]
};