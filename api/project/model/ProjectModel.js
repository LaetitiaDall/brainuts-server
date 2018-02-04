'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({

        name: {
            type: String,
        },

        admins: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        ],

        users: [
            {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        ],

    }, {
        usePushEach: true
    }
);

class ProjectClass {

    users;
    admins;

    static findByName(name, cb) {
        return this.findOne({'name': name}, cb).populate('users');
    }

    isParticipant(user) {
        return this.users.test((u) => u._id === user._id);
    }

    hasParticipants() {
        return !this.users || this.users.length === 0;
    }

    removeParticipant(user) {
        this.users.removeIf(u => {
            return u._id === user._id
        });
    }

    isAdmin(user) {
        return this.admins.test((u) => u._id === user._id);
    }

    hasAdmins() {
        return !this.admins || this.admins.length === 0;
    }

    removeAdmin(user) {
        this.admins.removeIf(u => {
            return u._id === user._id
        });
    }

}

ProjectSchema.loadClass(ProjectClass);

module.exports = mongoose.model('Project', ProjectSchema);