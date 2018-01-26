var TokenService = {};

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

TokenService.ensureAuthorized = function (req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        UserModel.findOne({token: req.token},
            function (err, user) {
                if (err) {
                    return res.status(403).send({
                        note: 'Error reading database token.'
                    });
                }
                req.user = user;
                next();
            }).select('+token');
    } else {
        return res.status(403).send({
            note: 'Unauthorized'
        });
    }
};

module.exports = TokenService;