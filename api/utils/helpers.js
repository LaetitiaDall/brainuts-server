var ucfirst = require('ucfirst');
var helpers = {};
var accentedUsers = "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";

helpers.forceAlphaNumeric = function (str) {
    return str.replace(new RegExp("[^a-z0-9"+accentedUsers+"]/gi", ''));
};

helpers.prepareName = function (str) {
    return ucfirst(helpers.forceAlphaNumeric(str));
};

helpers.checkCallback = function(cb){
    if (cb) return cb;
    else return function(){};
};

module.exports = helpers;

