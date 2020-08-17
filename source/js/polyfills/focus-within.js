// for polyfill use only require
const { default: focusWithin } = require('focus-within');

document.addEventListener('DOMContentLoaded', () => {
    focusWithin(document);
});
