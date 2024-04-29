const path = require('node:path');
const nunjucksRuntime = require('nunjucks/src/runtime');

const RELATIVE_PATTERN = /^\.{1,2}\//;

/**
 * Include with tag parser
 * @param {object} options - parser options
 */
function IncludeWithExtension(options) {
    this.cwd = '';
    this.nunjucksEnv = options.nunjucksEnv;
    this.tags = [options.tagName || 'includeWith'];

    this.parse = (parser, nodes) => {
        const token = parser.nextToken();
        const args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        return new nodes.CallExtension(this, 'run', args, null);
    };

    this.preprocess = (templateSrc, templatePath) => {
        if (templatePath) {
            this.cwd = path.dirname(templatePath);
        }
        return templateSrc;
    };

    this.run = (context, partialPath, data = {}, { useContext = true } = {}) => {
        const fullPath = RELATIVE_PATTERN.test(partialPath) ? path.resolve(this.cwd, partialPath) : partialPath;
        const mergedContext = useContext ? { ...context.ctx, ...data } : data;
        const renderResult = this.nunjucksEnv.render(fullPath, mergedContext);
        return new nunjucksRuntime.SafeString(renderResult);
    };
}

module.exports = IncludeWithExtension;
