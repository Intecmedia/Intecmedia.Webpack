/* eslint max-len: "off" */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const htmllint = require('htmllint');
const weblog = require('webpack-log');

const logger = weblog({ name: 'html-lint' });
const htmllintrc = JSON.parse(fs.readFileSync('./.htmllintrc', 'utf8'));

const ENV = require('./app.env.js');

if (htmllintrc.plugins) {
    htmllint.use(htmllintrc.plugins);
}

glob(`${ENV.OUTPUT_PATH}/**/*.html`, {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const relative = slash(path.relative(__dirname, filename));
        const html = fs.readFileSync(filename, 'utf8').toString();
        htmllint(html, htmllintrc).then((issues) => {
            if (!issues || !issues.length) {
                logger.info(`skipped ${relative}`);
                return;
            }
            issues.forEach((issue) => {
                logger.error(`${relative}: line ${issue.line || 0} col [${issue.column || 0}]`);
                logger.warn(`${htmllint.messages.renderIssue(issue)}\n`);
            });
            if (issues.length > 0) {
                process.exitCode = 1;
            }
        }).catch((exception) => {
            throw new Error(`error in ${relative}: ${exception}`);
        });
    });
});
