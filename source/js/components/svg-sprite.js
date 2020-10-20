/* global VERBOSE */
const svgSprites = require.context('../../img/svg-sprite/', true, /\.svg$/);

if (VERBOSE) {
    console.log('[svg-sprite]', svgSprites.keys());
}
