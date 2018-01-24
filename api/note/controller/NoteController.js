'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');
var NoteService = require('../service/NoteService');

var NoteController = {};

NoteController.listAll = function (req, res) {
    NoteModel.find({}, function (err, notes) {
        if (err)
            res.send(err);
        else
            res.json(notes);
    });
};


NoteController.listAllByTag = function (req, res) {
    NoteModel.find({}, function (err, notes) {
        if (err)
            res.send(err);
        else
            res.json(notes);
    });
};



NoteController.read = function (req, res) {
    NoteModel.findById(req.params.id, function (err, note) {
        if (err)
            res.send(err);
        else
            res.json(note);
    });
};


module.exports = NoteController;
