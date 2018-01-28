'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');
var helpers = require('../../utils/helpers');
var TagService = require('../../tag/service/TagService');
var TagEvents = require('../../tag/event/TagEvents');

class NoteService {

    constructor() {
        const self = this;
        TagEvents.onTagChanged((tag, cb) => {
            // When a tag change, must set all notes related.
            self.linkNotesToThisTag(tag, cb)
        });
    }

    linkNotesToThisTag(tag, cb) {
        var self = this;
        cb = helpers.checkCallback(cb);
        self.searchNotesForTag(tag, (err, notes) => {
            if (err) return cb(err);
            console.log("Found " + notes.length + " related to #" + tag.name);
            tag.refCount = notes.length;
            tag.save((err, tag) => {
                if (err){
                    return cb(err);
                }
                notes.forEach(note => {
                    if (!note.tags) {
                        note.tags = [];
                    }
                    note.tags.push(tag);
                    note.save();
                });
                return cb(null, tag);
            });

        });
    }

    findAllNotes(cb) {
        NoteModel.find({}, cb).populate('user').populate('tags').sort('-creationDate');
    }

    simplifyNoteContent(content) {
        content = content.toLowerCase();
        content = helpers.replaceAccents(content);
        content = helpers.replaceSpecialChars(content, ' ');
        return content;
    }

    /**
     * Search inside all existing notes for a tag name and its alias
     * @param tag
     * @param cb
     */
    searchNotesForTag(tag, cb) {
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
                    let content = self.simplifyNoteContent(note.content);

                    // Check if tag exist in content
                    if (content.indexOf(tag.name.toLowerCase()) >= 0) {
                        finalList.push(note);
                        continue;
                    }

                    // Check if aliases of tag exists in content
                    var aliasArray = tag.alias.split(',');
                    for (a = 0; a < aliasArray.length; a++) {
                        alias = aliasArray[a].trim();
                        if (!alias) continue;

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

    findAllByTag(tagName, cb) {
        TagService.findByName(tagName, (err, tag) => {
            if (err) return cb(err);
            NoteModel.find({'tags': tag}, cb);
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

        TagService.findTagsOfContent(self.simplifyNoteContent(content), function (err, tags) {
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
                TagService.findTagsOfContent(self.simplifyNoteContent(content), function (err, tags) {
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

