'use strict';
const TokenService = require('../../auth/TokenService');

var NoteRoutes = function (app) {
    var NoteController = require('../controller/NoteController');


    app.route('/notes')
        .get(TokenService.ensureAuthorized, NoteController.listAll);

    app.route('/notes/:id')
        .get(TokenService.ensureAuthorized, NoteController.read)
        .put(TokenService.ensureAuthorized, NoteController.update)
        .delete(TokenService.ensureAuthorized, NoteController.remove);

    app.route('/notes')
        .post(TokenService.ensureAuthorized, NoteController.create);

    app.route('/notes/:tag')
        .get(TokenService.ensureAuthorized, NoteController.listAllByTag);
};

module.exports = NoteRoutes;