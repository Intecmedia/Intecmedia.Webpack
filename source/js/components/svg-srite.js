const svg4everybody = require('svg4everybody');

function requireAll(r) {
    r.keys().forEach(r);
}
console.log(require.context('../../img/svg-sprite/', true, /\.svg$/));

svg4everybody();
