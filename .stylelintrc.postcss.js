/* eslint "sort-keys": "error" -- more readability keys */

const deepMerge = require('lodash.merge');
const sharedConfig = require('./.stylelintrc.shared');

const ENV = require('./app.env');

module.exports = deepMerge({}, sharedConfig, {
    'defaultSeverity': ENV.PROD || ENV.DEBUG ? 'error' : 'warning',
    'extends': [...sharedConfig.extends],
    'plugins': [
        // 'stylelint-no-nested-media',
        'stylelint-no-unsupported-browser-features',
        ...sharedConfig.plugins,
    ],
    'rules': {
        ...(ENV.PROD
            ? // code style rules (slowest)
              {
                  'declaration-property-value-no-unknown': true,
                  // 'pitcher/no-nested-media': true,
                  'plugin/no-unsupported-browser-features': [
                      true,
                      {
                          'browsers': ENV.BROWSERS,
                          'ignore': [
                              'css-scrollbar',
                              'css-snappoints',
                              'css-file-selector-button',
                              'css-marker-pseudo',
                              'css-media-interaction',
                              'css-featurequeries',
                              'css-filters',
                              'css-gradients',
                              'css-resize',
                              'css-touch-action',
                              'css3-cursors-grab',
                              'css3-cursors-newer',
                              'css3-cursors',
                              'pointer-events',
                              'pointer',
                              'will-change',
                              'flexbox-gap',
                          ],
                          'ignorePartialSupport': true,
                      },
                  ],
              }
            : // dev-only rules (better dev experience)
              {
                  'declaration-property-value-no-unknown': null,
                  'plugin/no-unsupported-browser-features': null,
                  // 'pitcher/no-nested-media': null,
              }),
    },
});
