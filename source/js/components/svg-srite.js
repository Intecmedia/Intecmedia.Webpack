const svg4everybody = require('svg4everybody');

require.context('../../img/svg-sprite/', true, /\.svg$/);

jQuery(($) => {
    svg4everybody();

    $(window).on('pushState replaceState', () => {
        // Barba events
        setTimeout(() => {
            svg4everybody();
        }, 0);
    });
});
