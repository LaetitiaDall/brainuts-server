'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var helpers = require('../../utils/helpers');

class TagService {

    create(name, color, cb) {
        console.log("creating tag", name, color);
        helpers.checkCallback(cb);

        TagModel.findByName(name, function (err, tag) {
            if (err) {
                return cb(err)
            }
            if (tag) {
                return cb(new Error("Tag already exists"));
            } else {
                var Tag = new TagModel({
                    name: name,
                    color: color,
                });
                return Tag.save(cb);
            }
        });

    };

    createAllTags(content){
        var hashtags = content.match(/#(\w+)/g);
        console.log(hashtags);

    }


}

module.exports = new TagService();