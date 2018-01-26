'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({

    content: {
        type: String,
    },

    creationDate: {
        type: Date,
        default: Date.now
    },

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

});

class NoteClass {

    static findByTag(tag, cb) {
        return this.find({'content': tag}, cb);
    }

    static findById(id, cb) {
        return this.findOne({'_id': id}, cb);
    }

}

NoteSchema.loadClass(NoteClass);

module.exports = mongoose.model('Note', NoteSchema);