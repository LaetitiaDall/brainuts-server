'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');
var helpers = require('../../utils/helpers');
var TagService;

class NoteService {

    findAllNotes(cb) {
        NoteModel.find({}, cb).populate('user').populate('tags').sort('-creationDate');
    }

    simplifyContent(content) {
        content = content.toLowerCase();
        content = helpers.replaceAccents(content);
        content = helpers.replaceSpecialChars(content, ' ');
        return content;
    }

    removeTagFromAllNotes(tagId, cb) {
        NoteModel.find({'tags._id': tagId}, function (err, notes) {
            console.log("Found notes with tag:", notes);
        });
    }

    findNotesForTag(tag, cb) {
        var self = this;
        let finalList = [];
        NoteModel.find({}, function (err, notes) {
            if (err) {
                return cb(err);
            }

            if (notes) {
                let note, alias, i, a;
                for (i = 0; i < notes.length; i++) {
                    note = notes[i];
                    let content = self.simplifyContent(note.content);

                    // Check if tag exist in content
                    if (content.indexOf(tag.name.toLowerCase()) >= 0) {
                        finalList.push(note);
                        continue;
                    }

                    // Check if aliases of tag exists in content
                    for (a = 0; a < tag.alias.length; a++) {
                        alias = tag.alias[a];

                        if (content.indexOf(alias.toLowerCase()) >= 0) {
                            finalList.push(note);
                            break;
                        }
                    }

                }

                return cb(null, finalList);


            } else {
                return cb(null, []);
            }

        }).populate('tags');
    };

    linkNotesToThisTag(tag, cb) {
        var self = this;
        cb = helpers.checkCallback(cb);
        self.findNotesForTag(tag, (err, notes) => {

            if (err) return cb(err);
            console.log("Found "+notes.length+" related to #" + tag.name);
            notes.forEach(note => {
                if (!note.tags) {
                    note.tags = [];
                }
                note.tags.push(tag);
                note.save();
            });
        });
    }

    create(content, user, cb) {
        var self = this;

        helpers.checkCallback(cb);

        TagService.createAllTags(content);

        var note = new NoteModel({
            content: content,
            user: user,
            creationDate: new Date(),
            tags: []
        });

        TagService.findTagsOfContent(self.simplifyContent(content), function (err, tags) {
            if (err) {
                return cb(err);
            }

            note.tags = tags;
            return note.save(cb);
        });

    };

    remove(id, cb) {
        helpers.checkCallback(cb);
        NoteModel.findById(id, function (err, note) {
            if (err) {
                return cb(err);
            }
            if (note) {
                note.remove(cb);
            } else {
                cb(new Error("the note was already deleted"));
            }

        })

    }

    update(id, content, user, cb) {
        const self = this;
        helpers.checkCallback(cb);
        return NoteModel.findById(id, function (err, note) {
            if (err) {
                return cb(err);
            }

            if (note) {
                TagService.createAllTags(content);
                note.content = content;
                note.creationDate = new Date();
                note.user = user;
                TagService.findTagsOfContent(self.simplifyContent(content), function (err, tags) {
                    if (err) {
                        return cb(err);
                    }

                    note.tags = tags;
                    note.save(cb);
                });

            } else {
                cb(new Error("the note does not exists and can not be updated"));
            }

        })
    }

    read(id, content, cb) {
        return NoteModel.findById(id, cb);
    }

}

module.exports = new NoteService();

TagService = require('../../tag/service/TagService');
