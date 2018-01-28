'use strict';
const TokenService = require('../../auth/TokenService');

var TagRoutes = function (app) {
    var TagController = require('../controller/TagController');

    app.route('/tags')
        .get(TokenService.ensureAuthorized, TagController.listAll);

    app.route('/tags/:id')
        .get(TokenService.ensureAuthorized, TagController.read)
        .put(TokenService.ensureAuthorized, TagController.update)
        .delete(TokenService.ensureAuthorized, TagController.remove);


};

module.exports = TagRoutes;