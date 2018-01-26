'use strict';

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var rand = require("generate-key");
var passwordHash = require('password-hash');
var helpers = require('../../utils/helpers');
var debug = require('debug')('user');


console.log(debug.enabled);

class UserService {

    createUser(name, password, cb){
        cb = helpers.checkCallback(cb);
        var userData = {
            token : rand.generateKey(24),
            name : name,
            password: passwordHash.generate('password')
        };

        UserModel.findOne({name: new RegExp(userData.name, "i")},
            function (err, user) {

                if (err)
                    return cb(err);

                if (user) {
                    debug("User %o already exists.", user.name);
                    return cb(new Error("User already exists."));
                }

                var user = new UserModel(
                    userData
                );

                user.save( function(err, data) {
                    return cb(err, data);
                });

            });
    }

    login(name, password, cb){
        console.log("login with", name, password);

        cb = helpers.checkCallback(cb);

        UserModel.findOne({name: name},
            function (err, user) {

                if (err)
                    return cb(err);

                if (!user) {
                    return cb(new Error("no user found"), null);
                }

                if (passwordHash.verify(password, user.password)){
                    return cb(null, user);
                }else{
                    return cb(new Error("wrong login"));
                }

            });
    }

}

module.exports = new UserService();