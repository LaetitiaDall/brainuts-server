var ucfirst = require('ucfirst');
var helpers = {};
var accentedUsers = "àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ";


helpers.replaceSpecialChars = function (str, rep) {
    return str.replace(/[^a-z0-9A-Z]/gi, rep);
};

helpers.replaceAccents = function (str) {
    str = str.replace(/[àáâãäå]/g, 'a');
    str = str.replace(/[èéêë]/g, 'e');
    str = str.replace(/[ôöòó]/g, 'o');
    str = str.replace(/[ç]/g, 'c');
    return str;
};

helpers.forceAlphaNumeric = function (str) {
    return str.replace(new RegExp("[^a-z0-9" + accentedUsers + "]/gi", ''));
};

helpers.prepareName = function (str) {
    return ucfirst(helpers.forceAlphaNumeric(str));
};

helpers.checkCallback = function (cb) {
    if (cb) return cb;
    else return function () {
    };
};

helpers.hashCode = function (str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

helpers.intToRGB = function (i) {
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
};

module.exports = helpers;

