'use strict';
const TokenService = require('../../auth/TokenService');

var TagRoutes = function (app) {
    var TagController = require('../controller/TagController');

    app.route('/tags')
        .get(TokenService.ensureAuthorized, TagController.listAll);

};

module.exports = TagRoutes;