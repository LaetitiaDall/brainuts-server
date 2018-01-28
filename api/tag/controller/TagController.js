'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var TagService = require('../service/TagService');
var TagController = {};

TagController.listAll = function (req, res) {
    TagModel.find({}, function (err, Tags) {
        if (err)
            res.status(500).send(err);
        else
            res.json(Tags);
    });
};

TagController.read = function (req, res) {
    TagService.read(req.params.id, function (err, note) {
        if (err)
            res.status(500).send(err);
        else
            res.json(note);
    });
};


TagController.update = function (req, res) {
    TagService.update(req.params.id, req.body, function (err, note) {
        if (err)
            res.send(err);
        else
            res.json(note);
    });
};

TagController.remove = function (req, res) {
    TagService.remove(req.params.id, function (err, tag) {
        if (err)
            res.status(500).send(err);
        else
            res.json(tag);
    });
};

module.exports = TagController;
