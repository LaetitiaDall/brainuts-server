'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var helpers = require('../../utils/helpers');

class TagService {

    create(name, color, cb) {
        cb = helpers.checkCallback(cb);

        TagModel.findByName(name, function (err, tag) {
            if (err) {
                return cb(err)
            }
            if (tag) {
                return cb(new Error("Tag already exists"));
            } else {
                console.log("creating tag", name, color);
                var Tag = new TagModel({
                    name: name,
                    color: color,
                });
                return Tag.save(cb);
            }
        });

    };


    remove(id, cb){
        helpers.checkCallback(cb);
        TagModel.findById(id, function(err, note) {
            if (err){
                return cb(err);
            }
            if(note){
                note.remove(cb);
            }else{
                cb(new Error("the tag was already deleted"));
            }

        })

    }

    createAllTags(content) {
        var self = this;
        var hashtags = content.match(/#(\w+)/g);

        if (!hashtags) return;
        hashtags.forEach(function (tag) {
            console.log("found tag", tag);
            tag = tag.replace("#", '');
            self.create(tag, helpers.intToRGB(helpers.hashCode(tag)));
        });
    }
}

module.exports = new TagService();