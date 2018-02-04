'use strict';
const TokenService = require('../../auth/TokenService');
const ProjectController = require('../controller/ProjectController');

module.exports = function (app) {

    app.route('/projects')
        .get(TokenService.ensureAuthorized, ProjectController.listAll);

    app.route('/projects/:id')
        .get(TokenService.ensureAuthorized, ProjectController.read)
        .put(TokenService.ensureAuthorized, ProjectController.update)
        .delete(TokenService.ensureAuthorized, ProjectController.quit);

    app.route('/projects/:id/user')
        .put(TokenService.ensureAuthorized, ProjectController.addUser)
        .delete(TokenService.ensureAuthorized, ProjectController.removeUser);
};