/* eslint max-len: "off" */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const slash = require('slash');
const htmllint = require('htmllint');
const weblog = require('webpack-log');
const { fileURLToPath } = require('url');
const W3CValidator = require('node-w3c-validator');

const loggerHtmlLint = weblog({ name: 'html-lint' });
const loggerW3CValidator = weblog({ name: 'w3c-validator' });
const htmllintrc = JSON.parse(fs.readFileSync('./.htmllintrc', 'utf8'));

if (htmllintrc.plugins) {
    htmllint.use(htmllintrc.plugins);
}

const callbackHtmlLint = () => glob('./build/**/*.html', {
    ignore: [],
}, (error, files) => {
    if (error) throw error;

    files.forEach((filename) => {
        const relative = slash(path.relative(__dirname, filename));
        const html = fs.readFileSync(filename, 'utf8').toString();
        htmllint(html, htmllintrc).then((issues) => {
            if (issues === false) {
                loggerHtmlLint.info(`skipped ${relative}`);
                return;
            }
            issues.forEach((issue) => {
                loggerHtmlLint.info(`${relative}: line ${issue.line} col ${issue.column}`);
                loggerHtmlLint.warn(`${htmllint.messages.renderIssue(issue)}\n`);
            });
            if (issues.length > 0) {
                process.exitCode = 1;
            }
        }).catch((exception) => {
            throw new Error(`error in ${relative}: ${exception}`);
        });
    });
});

const callbackW3CValidator = callback => W3CValidator('./build/**/*.html', {
    format: 'json',
    skipNonHtml: true,
    verbose: false,
    stream: false,
}, (exception, output) => {
    if (exception === null) {
        return;
    }
    const { messages } = JSON.parse(output);
    if (messages.length > 0) {
        process.exitCode = 1;
    }
    messages.forEach((message) => {
        const relative = slash(path.relative(__dirname, fileURLToPath(message.url)));
        loggerW3CValidator.info(`${relative}: line [${message.lastLine}] col [${message.firstColumn}-${message.lastColumn}]`);
        loggerW3CValidator.warn(`${message.message}\n`);
    });
    callback();
});

callbackW3CValidator(callbackHtmlLint);
