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

TagController.remove = function (req, res) {
    console.log("Removing", req.params.id);
    TagService.remove(req.params.id, function (err, tag) {
        if (err)
            res.status(500).send(err);
        else
            res.json(tag);
    });
};

module.exports = TagController;
