'use strict';

var NoteRoutes = function (app) {
    var NoteController = require('../controller/NoteController');


    app.route('/notes')
        .get(NoteController.listAll);

    app.route('/notes/:id')
        .get(NoteController.read)
        .put(NoteController.update)
        .delete(NoteController.remove);

    app.route('/notes')
        .post(NoteController.create);

    app.route('/notes/:tag')
        .get(NoteController.listAllByTag);
};

module.exports = NoteRoutes;