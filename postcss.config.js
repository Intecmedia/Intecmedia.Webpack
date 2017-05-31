const PROD = process.argv.indexOf("-p") !== -1;

module.exports = {
    sourceMap: !PROD,
    plugins: [
        require("autoprefixer")({
            browsers: [
                "Android 2.3",
                "Android >= 4",
                "Chrome >= 20",
                "Firefox >= 24",
                "Explorer >= 8",
                "iOS >= 6",
                "Opera >= 12",
                "Safari >= 6"
            ],
            add: true,
        }),
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