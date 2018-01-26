'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var helpers = require('../../utils/helpers');

class TagService {

    create(name, color, cb) {
        helpers.checkCallback(cb);

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

    createAllTags(content){
        var hashtags = content.match(/#(\w+)/g);
        for (var tag in hashtags){
            if (hashtags.hasOwnProperty(tag)){
                tag = tag.replace("#", '');
                this.create(tag, helpers.intToRGB(helpers.hashCode(tag)));
            }
        }
    }


}

module.exports = new TagService();