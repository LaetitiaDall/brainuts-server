'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');
var helpers = require('../../utils/helpers');
var TagService = require('../../tag/service/TagService');
var TagEvents = require('../../tag/event/TagEvents');
var asy = require('async');

class NoteService {

    constructor() {
        const self = this;

        TagEvents.onTagUpdated((tag, cb) => {
            // When a tag change, must set all notes related.
            asy.waterfall(
                [
                    function (next) {
                        self.removeTagFromNotes(tag, next)
                    },
                    function (tag, next) {
                        self.linkNotesToThisTag(tag, next);
                    },
                ],
                function (err, tag) {
                    return cb(err, tag);
                }
            );

        });

        TagEvents.onTagCreated((tag, cb) => {
            // When a tag change, must set all notes related.
            asy.waterfall(
                [
                    function (next) {
                        self.removeTagFromNotes(tag, next)
                    },
                    function (tag, next) {
                        self.linkNotesToThisTag(tag, next);
                    },
                ],
                function (err, tag) {
                    return cb(err, tag);
                }
            );
        });

        TagEvents.onTagRemoved((tag, cb) => {
            // When a tag change, must set all notes related.
            self.removeTagFromNotes(tag, cb)
        });
    }

    removeTagFromNotes(tag, cb) {
        cb = helpers.checkCallback(cb);
        NoteModel.update(
            {},
            {"$pull": {"tags": tag._id}},
            {"multi": true},
            function (err, numberAffected) {
                if (err) {
                    console.log(err);
                    return cb(err);
                } else {
                    console.log("Tag change affected notes", numberAffected);
                    return cb(null, tag);
                }
            }
        );
    }

    linkNotesToThisTag(tag, cb) {
        var self = this;
        self.searchNotesForTag(tag, (err, notes) => {
            if (err) return cb(err);
            console.log("Found " + notes.length + " related to #" + tag.name);
            tag.refCount = notes.length;
            tag.save((err, tag) => {
                if (err) {
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

        asy.waterfall([
            (next) => {
                return NoteModel.find({}, next);
            },
            (notes, next) => {
                let finalList = [];
                let note, i;
                for (i = 0; i < notes.length; i++) {
                    note = notes[i];
                    if (TagService.isTagInContent(tag, self.simplifyNoteContent(note.content))) {
                        finalList.push(note);
                    }
                }
                return next(null, finalList);
            }

        ], cb);

        NoteModel.find({}, function (err, notes) {
            if (err) {
                return cb(err);
            }



        }).populate('tags');
    };

    findAllByTag(tagName, cb) {
        return TagService.findByName(tagName, (err, tag) => {
            if (err) return cb(err);
            NoteModel.find({'tags': tag}, cb);
        });
    }

    create(content, user, cb) {
        var self = this;

        return asy.waterfall(
            [
                function (next) {
                    TagService.createAllTagsOfContent(content, next)
                },
                function (next) {
                    TagService.findExistingTagsInContent(self.simplifyNoteContent(content), next)
                },
                function (tags, next) {
                    TagService.changeTagsRefCount(tags, 1, next)
                },
                function (tags, next) {
                    var note = new NoteModel({
                        content: content,
                        user: user,
                        creationDate: new Date(),
                        tags: tags
                    });
                    note.save(next)
                },
            ],
            cb
        );

    };

    remove(id, cb) {
        return asy.waterfall([
                (next) => {
                    return NoteModel.findById(id, next)
                },
                (note, next) => {

                    if (!note) {
                        return next(new Error("the note was already deleted"));
                    }

                    return note.remove((err) => {
                        return next(err, note)
                    });

                },
                (note, next) => {
                    return TagService.changeTagsRefCount(note.tags, -1, (err) => {
                        return next(err, note);
                    })
                }
            ]
            , cb);

    }

    update(id, content, user, cb) {
        const self = this;

        return asy.waterfall([
            (next) => {
                return NoteModel.findById(id, next)
            },
            (note, next) => {
                if (!note) {
                    return next(new Error("the note does not exists and can not be updated"));
                }
                return TagService.changeTagsRefCount(note.tags, -1, (err) => {
                    return next(err, note);
                })
            },
            (note, next) => {
                return TagService.createAllTagsOfContent(content, (err) => {
                    return next(err, note);
                })
            },
            (note, next) => {
                return TagService.findExistingTagsInContent(self.simplifyNoteContent(content), (err, tags) => {
                    return next(err, note, tags);
                })
            },
            (note, tags, next) => {
                return TagService.changeTagsRefCount(note.tags, 1, (err) => {
                    return next(err, note, tags);
                });
            },
            (note, tags, next) => {
                note.content = content;
                note.creationDate = new Date();
                note.user = user;
                note.tags = tags;
                note.save(next);
            }

        ], cb)
    }

    read(id, content, cb) {
        return NoteModel.findById(id, cb);
    }

}

module.exports = new NoteService();

