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

helpers.hashCode = function(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

helpers.intToRGB = function(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
};

module.exports = helpers;

