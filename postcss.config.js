const fs = require('fs');

const PROD = process.argv.indexOf("-p") !== -1;

var browsers = fs.readFileSync("./.browserslistrc", "utf8").trim().split(/\n/);

module.exports = {
    sourceMap: !PROD,
    plugins: [
        require("autoprefixer")({
            browsers: browsers,
            add: true,
        }),
        require("pixrem")({
            rootValue: 16,
            browsers: browsers,
            unitPrecision: 3,
        }),
        require("cssnano")({
            discardComments: { removeAll: true },
        }),
        require("stylelint")({
        }),
        require("css-mqpacker")({
            sort: true,
        }),
    ]
};