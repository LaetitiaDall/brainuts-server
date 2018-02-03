'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var TagEvents = require('../event/TagEvents');
var helpers = require('../../utils/helpers');
var asy = require('async');

class TagService {

    /**
     * Given a content string, return true if the tag is inside (checks tag and aliases)
     * @param tag
     * @param content
     * @returns {boolean}
     */
    isTagInContent(tag, content) {
        content = ' ' + content.trim() + ' ';
        var name = ' ' + tag.name.toLowerCase() + ' ';

        // Check if tag exist in content
        if (content.indexOf(name) >= 0) {
            return true;
        }

        // Check if aliases of tag exists in content
        let a, alias;
        let aliasArray = tag.alias.split(',');
        for (a = 0; a < aliasArray.length; a++) {
            alias = aliasArray[a];
            if (!alias) continue;
            alias = ' ' + alias.trim().toLowerCase() + ' ';
            if (content.indexOf(alias) >= 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Find all tags inside a content
     * @param content
     * @param cb
     * @returns array list of tags
     */
    findExistingTagsInContent(content, cb) {
        var self = this;
        let tagsInContent = [];
        TagModel.find({}, function (err, tags) {
            if (err) {
                return cb(err);
            }
            tags = tags || [];

            let tag, i;
            for (i = 0; i < tags.length; i++) {
                tag = tags[i];
                if (self.isTagInContent(tag, content)) {
                    tagsInContent.push(tag);
                }
            }
            return cb(null, tagsInContent);
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
            return cb(err, tags);
        });
    }

    changeTagRefCount(tag, val, cb) {
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
        return asy.waterfall([
            (next) => {
                return TagModel.findByName(name, next)
            },
            (tag, next) => {
                if (tag) {
                    return next(null, tag);
                } else {
                    var tag = new TagModel({
                        name: self.simplifyTagName(name),
                        color: color,
                        alias: []
                    });
                    return tag.save(next);
                }
            },
            (tag, lines, next) => {
                return TagEvents.notifyTagCreated(tag, next);
            }
        ], cb);

    }

    update(id, data, cb) {
        return asy.waterfall([
            (next) => {
                return TagModel.findById(id, next);
            },
            (tag, next) => {
                if (!tag) {
                    return next(new Error("the tag does not exists and can not be updated"));
                }
                tag.alias = data.alias;
                tag.name = data.name;
                tag.color = data.color;
                return tag.save(next);
            },
            (tag, lines, next) => {
                return TagEvents.notifyTagUpdated(tag, next);
            }
        ], cb);
    }

    remove(id, cb) {
        return asy.waterfall([
            (next) => {
                return TagModel.findById(id, next);
            },
            (tag, next) => {
                if (!tag) {
                    return next(new Error("the tag was already deleted"));
                }
                return tag.remove((err) => {
                    return next(err, tag);
                })
            },
            (tag, next) => {
                return TagEvents.notifyTagRemoved(tag, next);
            }

        ], cb);
    }

    read(id, content, cb) {
        return TagModel.findById(id, cb);
    }


}

module.exports = new TagService();
