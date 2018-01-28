'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var TagService = require('../service/TagService');

class TagController {


    listAll(req, res) {
        TagModel.find({}, (err, tags) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(tags);
        });
    };

    read(req, res) {
        TagService.read(req.params.id, (err, tag) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(tag);
        });
    };


    update(req, res) {
        TagService.update(req.params.id, req.body, (err, tag) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(tag);
            }
        });
    };


    remove(req, res) {
        TagService.remove(req.params.id, (err, tag) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(tag);
        });
    };

}

module.exports = new TagController();
