'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({

    content: {
        type: String,
    },

    created: {
        type: Date,
        default: Date.now
    },

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

});


class NoteClass {

    static findByTag(tag) {
        return this.find({'content': tag});
    }

    static findById(id) {
        return this.findOne({'_id': id});
    }

}

NoteSchema.loadClass(NoteClass);

module.exports = mongoose.model('Note', NoteSchema);