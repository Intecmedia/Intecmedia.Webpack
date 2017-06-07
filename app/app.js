require("./app.scss");
require("./_bootstrap.js");

const jQuery = require("jquery");
window["$"] = window["jQuery"] = jQuery;

console.log("Config enviroment: " + NODE_ENV);

jQuery(function($) {


});