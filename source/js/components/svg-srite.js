const svg4everybody = require('svg4everybody');

require.context('../../img/svg-sprite/', true, /\.svg$/);

svg4everybody();
