'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');
var helpers = require('../../utils/helpers');

class NoteService {

    create(content, user, cb) {
        console.log("creating", content, user);
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
            if(note){
                note.remove(cb);
            }else{
                cb(new Error("the note was already deleted"));
            }

        })

    }

    update(id, content, cb) {
        helpers.checkCallback(cb);
        return NoteModel.findById(id, function(err, note) {
            if (err){
                return cb(err);
            }

            if (note) {
                console.log("found", note);
                note.content = content;
                note.date = new Date();
                note.save(cb);
            }else{
                cb(new Error("the note does not exists and can not be updated"));
            }

        })
    }

    read(id, content, cb){
        return NoteModel.findById(id, cb);
    }

}

module.exports = new NoteService();