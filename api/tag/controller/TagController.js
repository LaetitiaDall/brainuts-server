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



module.exports = TagController;
