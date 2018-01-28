const EventEmitter = require('events');
var helpers = require('../../utils/helpers');

class TagEvents extends EventEmitter {

    notifyTagChanged(tag, cb){
        cb = helpers.checkCallback(cb);
        if (!this.listenerCount('notifyTagChanged')){
            return cb(null, tag);
        }
        return this.emit('notifyTagChanged', tag, cb);
    }
    onTagChanged(cb){
        return this.on('notifyTagChanged', cb);
    }
}
module.exports = new TagEvents();