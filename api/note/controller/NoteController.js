'use strict';

var NoteService = require('../service/NoteService');

class NoteController {

    listAll(req, res) {
        NoteService.findAllNotes(function (err, notes) {
            if (err)
                res.status(500).send(err);
            else
                res.json(notes);
        })
    }

    listAllByTag(req, res) {
        NoteService.findAllByTag(req.param.tagName, (err, notes) => {
            if (err)
                return res.status(500).send(err);
            else
                return res.json(notes);
        });

    };

    read(req, res) {
        NoteService.read(req.params.id, function (err, note) {
            if (err)
                res.status(500).send(err);
            else
                res.json(note);
        });
    };

    create(req, res) {
        NoteService.create(req.body.content, req.user, (err, note) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(note);
        });

    };

    update(req, res) {
        NoteService.update(req.params.id, req.body.content, req.user, (err, note) => {
            if (err)
                res.send(err);
            else
                res.json(note);
        });
    };

    remove(req, res) {
        NoteService.remove(req.params.id, (err, note) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(note);
        });
    };
}

module.exports = new NoteController();
