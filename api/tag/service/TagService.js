'use strict';

var mongoose = require('mongoose');
var TagModel = mongoose.model('Tag');
var NoteModel = mongoose.model('Note');

var helpers = require('../../utils/helpers');
var NoteService;

class TagService {

    findTagsOfContent(content, cb) {
        let tagsInNote = [];

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
                        tagsInNote.push(tag);
                        continue;
                    }

                    // Check if aliases of tag exists in content
                    for (a = 0; a < tag.alias.length; a++) {
                        alias = tag.alias[a];

                        if (content.indexOf(alias.toLowerCase()) >= 0) {
                            tagsInNote.push(tag);
                            break;
                        }
                    }

                }

                return cb(null, tagsInNote);


            } else {
                return cb(null, []);
            }

        });

    };

    simplifyTagName(name) {
        name = helpers.replaceAccents(name);
        name = helpers.replaceSpecialChars(name, "");
        return name;
    }

    findByName(name, cb) {
        return TagModel.findByName(name, cb).populate('notes').populate('notes.user');
    }

    create(name, color, cb) {
        const self = this;
        cb = helpers.checkCallback(cb);

        TagModel.findByName(name, function (err, tag) {
            if (err) {
                return cb(err)
            }
            if (tag) {
                return cb(new Error("Tag already exists"));
            } else {
                console.log("creating tag", name, color);

                var tag = new TagModel({
                    name: self.simplifyTagName(name),
                    color: color,
                    alias: []
                });

                tag.save(function (err, tag) {
                    if (err) {
                        return cb(err);
                    }
                    NoteService.linkNotesToThisTag(tag);
                    return cb(null, tag);
                });


            }
        });
    };

    update(id, data, cb) {
        const self = this;
        helpers.checkCallback(cb);
        return TagModel.findById(id, function (err, tag) {
            if (err) {
                return cb(err);
            }

            // First, remove all tags from notes
            NoteService.removeTagFromNotes(id);

            if (tag) {
                tag.alias = data.alias;
                tag.name = data.name;
                tag.color = data.color;

                NoteService.findNotesForTag(tag, function (err, notes) {
                    if (err) {
                        return cb(err)
                    }
                    tag.notes = notes;
                    return tag.save(cb);

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
                tag.remove(cb);
            } else {
                cb(new Error("the tag was already deleted"));
            }
        })
    }

    read(id, content, cb) {
        return TagModel.findById(id, cb);
    }

    createAllTags(content) {
        const self = this;
        var hashtags = content.match(/#(\w+)/g);

        if (!hashtags) return;
        hashtags.forEach(function (tagname) {
            tagname = tagname.replace("#", '');
            self.create(tagname, helpers.intToRGB(helpers.hashCode(tagname)));
        });
    }
}

module.exports = new TagService();

NoteService = require('../../note/service/NoteService');
