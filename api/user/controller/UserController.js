'use strict';

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var UserController = {};
var rand = require("generate-key");
var helpers = require('../../utils/helpers');

UserController.me = function (req, res) {
    res.json(
        req.user
    );
};

module.exports = UserController;
