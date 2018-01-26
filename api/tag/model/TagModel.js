'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({

    name: {
        type: String,
    },

    color: {
        type: String
    },


});

class TagClass {

    static findByName(name, cb) {
        return this.findOne({'name': name}, cb);
    }

}

TagSchema.loadClass(TagClass);

module.exports = mongoose.model('Tag', TagSchema);