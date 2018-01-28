'use strict';
const TokenService = require('../../auth/TokenService');
const TagController = require('../controller/TagController');

module.exports = function (app) {

    app.route('/tags')
        .get(TokenService.ensureAuthorized, TagController.listAll);

    app.route('/tags/:id')
        .get(TokenService.ensureAuthorized, TagController.read)
        .put(TokenService.ensureAuthorized, TagController.update)
        .delete(TokenService.ensureAuthorized, TagController.remove);


};