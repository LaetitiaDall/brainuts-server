'use strict';
const TokenService = require('../../auth/TokenService');
const NoteController = require('../controller/NoteController');

module.exports = function (app) {
    app.route('/notes')
        .get(TokenService.ensureAuthorized, NoteController.listAll)
        .post(TokenService.ensureAuthorized, NoteController.create);

    app.route('/notes/tag/:tagName')
        .get(TokenService.ensureAuthorized, NoteController.listAllByTag);

    app.route('/notes/:id')
        .get(TokenService.ensureAuthorized, NoteController.read)
        .put(TokenService.ensureAuthorized, NoteController.update)
        .delete(TokenService.ensureAuthorized, NoteController.remove);
};