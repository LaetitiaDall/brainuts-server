'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
        select: false
    },

});


class UserClass {

    static findByName(name) {
        return this.findOne({'name': name});
    }

    static findById(id) {
        return this.findOne({'_id': id});
    }

    static findByToken(token) {
        return this.findOne({'token': token}).select('+token');
    }
}

UserSchema.loadClass(UserClass);

module.exports = mongoose.model('User', UserSchema);