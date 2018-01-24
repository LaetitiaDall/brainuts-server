'use strict';

var mongoose = require('mongoose');
var NoteModel = mongoose.model('Note');

class NoteService {

    create(content) {
        var note = new NoteModel(content);
        return note.save();
    };

};

module.exports = new NoteService();