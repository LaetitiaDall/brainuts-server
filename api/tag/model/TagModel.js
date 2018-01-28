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

        alias: {
            type: String
        },

        refCount: {
            type: Number
        }

    }, {
        usePushEach: true
    }
);

class TagClass {
    static findByName(name, cb) {
        return this.findOne({'name': name}, cb);
    }
}

//Remove that from note when tag is removed.
TagSchema.pre('remove',function(cb) {
    this.model('Note').update(
        { },
        { "$pull": { "tags": this._id } },
        { "multi": true },
        function (err, numberAffected) {
            if (err) {
                console.log(err);
                return cb(err);
            } else {
                console.log("Tag removal affected notes", numberAffected);
                return cb(null);
            }
        }
    );
});
//Remove that from note when tag is updated.
TagSchema.pre('update',function(cb) {
    this.model('Note').update(
        { },
        { "$pull": { "tags": this._id } },
        { "multi": true },
        function (err, numberAffected) {
            if (err) {
                console.log(err);
                return cb(err);
            } else {
                console.log("Tag update affected notes", numberAffected);
            }
        }
    );
});

TagSchema.loadClass(TagClass);

module.exports = mongoose.model('Tag', TagSchema);