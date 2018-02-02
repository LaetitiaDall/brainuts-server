'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var TagEvents = require('../event/TagEvents');
var helpers = require('../../utils/helpers');
var asy = require('async');

class TagService {

    /**
     * Find all tags inside a content
     * @param content
     * @param cb
     * @returns array list of tags
     */
    findExistingTagsInContent(content, cb) {
        let tagsInContent = [];
        TagModel.find({}, function (err, tags) {
            if (err) {
                return cb(err);
            }

            if (tags) {
                let tag, alias, i, a;
                for (i = 0; i < tags.length; i++) {
                    tag = tags[i];

                    // Check if tag exist in content
                    if (content.indexOf(tag.name.toLowerCase()) >= 0) {
                        tagsInContent.push(tag);
                        continue;
                    }

                    // Check if aliases of tag exists in content
                    let aliasArray = tag.alias.split(',');
                    for (a = 0; a < aliasArray.length; a++) {
                        alias = tag.alias[a];
                        if (!alias) continue;
                        alias = alias.trim();

                        if (content.indexOf(alias.toLowerCase()) >= 0) {
                            tagsInContent.push(tag);
                            break;
                        }
                    }

                }

                return cb(null, tagsInContent);


            } else {
                return cb(null, []);
            }

        });

    };

    /**
     * Create all tags found in content if they don't exists
     * @param content
     */
    createAllTagsOfContent(content, cb) {

        const self = this;

        cb = helpers.checkCallback(cb);

        var hashtags = content.match(/#(\w+)/g);

        if (!hashtags)
            return cb(null);

        asy.each(hashtags, (tagname, next) => {
            tagname = tagname.replace("#", '');
            self.create(tagname, helpers.intToRGB(helpers.hashCode(tagname)), next);
        }, function (err) {
            return cb(err);
        });

    }

    changeTagsRefCount(tags, val, cb) {
        asy.each(tags, (tag, cb) => {
            return this.changeTagRefCount(tag, val, cb)
        }, function (err) {
            return cb(err);
        });
    }

    changeTagRefCount(tag, val, cb) {
        cb = helpers.checkCallback(cb);
        tag.refCount += val;
        return tag.save(cb);
    }

    simplifyTagName(name) {
        name = helpers.replaceAccents(name);
        name = helpers.replaceSpecialChars(name, "");
        return name;
    }

    findByName(name, cb) {
        return TagModel.findByName(name, cb);
    }

    create(name, color, cb) {
        const self = this;
        cb = helpers.checkCallback(cb);

        TagModel.findByName(name, (err, tag) => {
            if (err) {
                return cb(err)
            }
            if (tag) {
                return cb(null, tag);
            } else {

                console.log("Creating tag :", name);

                var tag = new TagModel({
                    name: self.simplifyTagName(name),
                    color: color,
                    alias: []
                });

                tag.save((err, tag) => {
                    if (err)
                        return cb(err);
                    else {
                        return TagEvents.notifyTagCreated(tag, cb);
                    }
                });
            }
        });
    };

    update(id, data, cb) {
        cb = helpers.checkCallback(cb);
        return TagModel.findById(id, function (err, tag) {
            if (err) {
                return cb(err);
            }
            if (tag) {
                tag.alias = data.alias;
                tag.name = data.name;
                tag.color = data.color;
                tag.save(function (err, tag) {
                    if (err) return cb(err);
                    else {
                        return TagEvents.notifyTagUpdated(tag, cb);
                    }
                });

            } else {
                cb(new Error("the tag does not exists and can not be updated"));
            }

        })
    }

    remove(id, cb) {
        cb = helpers.checkCallback(cb);
        TagModel.findById(id, function (err, tag) {
            if (err) {
                return cb(err);
            }
            if (tag) {
                tag.remove((err) => {
                    if (err) {
                        return cb(err);
                    }
                    else {
                        return TagEvents.notifyTagRemoved(tag, cb);
                    }
                });

            } else {
                cb(new Error("the tag was already deleted"));
            }
        })
    }

    read(id, content, cb) {
        return TagModel.findById(id, cb);
    }


}

module.exports = new TagService();
