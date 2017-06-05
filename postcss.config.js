const PROD = process.argv.indexOf("-p") !== -1;

module.exports = {
    sourceMap: !PROD,
    plugins: [
        require("stylelint")({
        }),
        require("postcss-focus")(),
        require("pixrem")({
            rootValue: 16,
            unitPrecision: 3,
        }),
        require("css-mqpacker")({
            sort: true,
        }),
        require("autoprefixer")({
            add: true,
        }),
        require("cssnano")({
            discardComments: { removeAll: true },
        }),
    ]
};