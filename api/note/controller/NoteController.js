'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');
var NoteService = require('../service/NoteService');

var NoteController = {};

NoteController.listAll = function (req, res) {
    NoteModel.find({}, function (err, notes) {
        if (err)
            res.status(500).send(err);
        else
            res.json(notes);
    }).populate('user').sort('-creationDate');
};

NoteController.listAllByTag = function (req, res) {
    NoteModel.find({}, function (err, notes) {
        if (err)
            res.status(500).send(err);
        else
            res.json(notes);
    });
};

NoteController.read = function (req, res) {
    NoteService.read(req.params.id, function (err, note) {
        if (err)
            res.status(500).send(err);
        else
            res.json(note);
    });
};

NoteController.create = function (req, res) {
    NoteService.create(req.body.content, req.user, function(err, note){
        if (err)
            res.status(500).send(err);
        else
            res.json(note);
    });

};

NoteController.update = function (req, res) {
    console.log("Updating", req.params.id);
    NoteService.update(req.params.id, req.body.content, function (err, note) {
        if (err)
            res.send(err);
        else
            res.json(note);
    });
};

NoteController.remove = function (req, res) {
    console.log("Removing", req.params.id);
    NoteService.remove(req.params.id, function (err, note) {
        if (err)
            res.status(500).send(err);
        else
            res.json(note);
    });
};


module.exports = NoteController;
