/* global VERBOSE */
const svg4everybody = require('svg4everybody');

const svgSprites = require.context('../../img/svg-sprite/', true, /\.svg$/);

if (VERBOSE) {
    console.log('[svg-sprite]', svgSprites.keys());
}

jQuery(($) => {
    svg4everybody();

    // SPA events
    $(window).on('pushstate popstate', () => {
        // wait side effects changes
        setTimeout(() => {
            svg4everybody();
        }, 0);
    });
});
