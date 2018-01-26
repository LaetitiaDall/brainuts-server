'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');

class NoteService {

    create(content, user, cb) {
        helpers.checkCallback(cb);
        var note = new NoteModel({
            content: content,
            user: user,
            creationDate: new Date(),
        });
        return note.save(cb);
    };

    remove(id, cb){
        helpers.checkCallback(cb);
        NoteModel.findById(id, function(err, note) {
            if (err){
                return cb(err);
            }
            note.content=content;
            note.delete(cb);
        })

    }

    update(id, content, cb) {
        helpers.checkCallback(cb);
        return NoteModel.findById(id, function(err, note) {
            if (err){
                return cb(err);
            }
            note.content=content;
            note.save(cb);

        })
    }

    read(id, content, cb){
        return NoteModel.findById(id, cb);
    }

}

module.exports = new NoteService();