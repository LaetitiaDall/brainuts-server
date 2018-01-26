'use strict';

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var UserService = require('../service/UserService');

var UserController = {};
var rand = require("generate-key");
var helpers = require('../../utils/helpers');

UserController.me = function (req, res) {
    res.json(
        req.user
    );
};

UserController.login = function (req, res) {
    UserService.login(req.body.name, req.body.password, function(err, user) {
        if (err)
            res.status(500).send(err.message);
        else
            res.json(user);
    });
};

module.exports = UserController;
