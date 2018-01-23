const fs = require('fs');
const path = require('path');
const glob = require('glob');
const htmllint = require('htmllint');
const weblog = require('webpack-log');

const logger = weblog({ name: 'html-lint' });
const htmllintrc = JSON.parse(fs.readFileSync('./.htmllintrc', 'utf8'));
const { output: { path: BUILD_PATH } } = require('./webpack.config.js');

if (htmllintrc.plugins) {
    htmllint.use(htmllintrc.plugins);
}

glob(`${BUILD_PATH}/**/*.html`, {
    ignore: [
        `${BUILD_PATH}/google*.html`,
        `${BUILD_PATH}/yandex_*.html`,
    ],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const relative = path.relative(__dirname, filename);
        const html = fs.readFileSync(filename, 'utf8').toString();
        htmllint(html, htmllintrc).then((issues) => {
            if (issues === false) {
                logger.info(`skipped ${relative}`);
                return;
            }
            issues.forEach((issue) => {
                logger.info(`${relative}: line ${issue.line} col ${issue.column}`);
                logger.warn(`${htmllint.messages.renderIssue(issue)}\n`);
            });
            logger.error(`found ${issues.length} errors out of ${files.length} files`);
            if (issues.length > 0) {
                process.exit(1);
            }
        }).catch((exception) => {
            throw new Error(`error in ${relative}: ${exception}`);
        });
    });
});
