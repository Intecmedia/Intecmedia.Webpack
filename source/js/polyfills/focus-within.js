// for polyfill use only require
const { default: focusWithin } = require('focus-within');

jQuery(() => {
    focusWithin(document);
});
