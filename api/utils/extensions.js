Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) != -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.removeAt = function (index) {
    this.splice(index, 1);
};

Array.prototype.test = function (callback) {
    var i = 0;
    while (i < this.length) {
        if (callback(this[i], i)) {
            return true;
        }
        else {
            ++i;
        }
    }
    return false;
};

Array.prototype.removeIf = function (callback) {
    var i = 0;
    while (i < this.length) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
        else {
            ++i;
        }
    }
};