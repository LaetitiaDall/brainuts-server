'use strict';

const TokenService = require('../../auth/TokenService');

var UserRoutes = function (app) {
    var UserController = require('../controller/UserController');

    app.route('/me')
        .get(TokenService.ensureAuthorized, UserController.me);

    app.route('/login')
        .post(UserController.login);

};

module.exports = UserRoutes;