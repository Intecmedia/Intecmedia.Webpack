const PROD = process.argv.indexOf("-p") !== -1;

module.exports = {
    plugins: [
        require("autoprefixer"),
        require("cssnano")({
            discardComments: { removeAll: PROD },
        }),
        require("stylelint")({
        }),
        require("css-mqpacker")({
            sort: true,
        }),
    ]
};