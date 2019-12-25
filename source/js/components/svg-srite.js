/* global NODE_ENV DEBUG */
const svg4everybody = require('svg4everybody');

const svgSprites = require.context('../../img/svg-sprite/', true, /\.svg$/);

if (NODE_ENV === 'development' || DEBUG) {
    console.log('[svg-sprite]', svgSprites.keys());
}

jQuery(($) => {
    svg4everybody();

    // SPA events
    $(window).on('pushState replaceState', () => {
        // wait side effects changes
        setTimeout(() => {
            svg4everybody();
        }, 0);
    });
});
