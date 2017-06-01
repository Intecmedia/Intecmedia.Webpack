const fs = require('fs');

const PROD = process.argv.indexOf("-p") !== -1;

var browsers = fs.readFileSync("./.browserslistrc", "utf8").split(/\n/).filter((i) => i.trim() !== "");

console.log("Browsers list:", JSON.stringify(browsers));

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