const AsyncEventEmitter = require('async-eventemitter');
var helpers = require('../../utils/helpers');

class TagEvents extends AsyncEventEmitter {

    notifyTagUpdated(tag, cb){
        console.log("NotifyTagUpdated.", tag.name);
        cb = helpers.checkCallback(cb);
        if (!this.listenerCount('tagUpdated')){
            return cb(null, tag);
        }
        return this.emit('tagUpdated', tag, function(err){
            return cb(err, tag);
        });
    }

    onTagUpdated(cb){
        return this.on('tagUpdated', cb);
    }

    notifyTagRemoved(tag, cb){
        console.log("NotifyTagRemoved.", tag.name);

        cb = helpers.checkCallback(cb);
        if (!this.listenerCount('tagRemoved')){
            return cb(null, tag);
        }
        return this.emit('tagRemoved', tag, function(err){
            return cb(err, tag);
        });
    }

    onTagRemoved(cb){
        return this.on('tagRemoved', cb);
    }

    notifyTagCreated(tag, cb){
        console.log("NotifyTagCreated.", tag.name);

        cb = helpers.checkCallback(cb);
        if (!this.listenerCount('tagCreated')){
            return cb(null, tag);
        }
        return this.emit('tagCreated', tag, function(err){
            return cb(err, tag);
        });
    }

    onTagCreated(cb){
        return this.on('tagCreated', cb);
    }
}

module.exports = new TagEvents();