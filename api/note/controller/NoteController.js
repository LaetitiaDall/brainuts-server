'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');
var NoteService = require('../service/NoteService');
var TagService = require('../../tag/service/TagService');

var NoteController = {};

NoteController.listAll = function (req, res) {
    NoteService.findAllNotes(function (err, notes) {
        if (err)
            res.status(500).send(err);
        else
            res.json(notes);
    })
};

NoteController.listAllByTag = function (req, res) {
    TagService.findByName(req.param.tagName, function(err, tag){
        if (err)
            return res.status(500).send(err);
        else
            return res.json(tag.notes);
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
    NoteService.update(req.params.id, req.body.content, req.user, function (err, note) {
        if (err)
            res.send(err);
        else
            res.json(note);
    });
};

NoteController.remove = function (req, res) {
    NoteService.remove(req.params.id, function (err, note) {
        if (err)
            res.status(500).send(err);
        else
            res.json(note);
    });
};


module.exports = NoteController;
