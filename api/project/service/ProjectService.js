'use strict';

var mongoose = require('mongoose');
var ProjectModel = mongoose.model('Project');
var ProjectEvents = require('../event/ProjectEvents');
var helpers = require('../../utils/helpers');
var asy = require('async');

class ProjectService {

    findByName(name, cb) {
        return ProjectModel.findByName(name, cb);
    }

    create(name, user, cb) {
        const self = this;
        return asy.waterfall([
            (next) => {
                return ProjectModel.findByName(name, next)
            },
            (project, next) => {
                if (project) {
                    return next(null, project);
                } else {
                    var project = new ProjectModel({
                        name: self.simplifyTagName(name),
                        users: [user]
                    });
                    return project.save(next);
                }
            }
        ], cb);
    }

    update(id, data, cb) {
        return asy.waterfall([
            (next) => {
                return ProjectModel.findById(id, next);
            },
            (project, next) => {
                if (!project) {
                    return next(new Error("the project does not exists and can not be updated"));
                }
                project.name = data.name;
                return project.save(next);
            }
        ], cb);
    }

    addAnotherUser(id, admin, user, cb) {
        if (admin._id === user._id){
            return cb(new Error("Can not add itself in a project."))
        }

        return asy.waterfall([
            (next) => {
                return ProjectModel.findById(id, next);
            },
            (project, next) => {
                if (!project) {
                    return next(new Error("the project does not exists and can not be updated"));
                }

                if (!project.isAdmin(admin)) {
                    return next(new Error("the user does not have the rights to do this"));
                }

                if (project.isParticipant(user)) {
                    return next(null, project);
                } else {
                    project.users.push(user);
                    return project.save(next);
                }
            }
        ], cb);
    }

    removeAnotherUser(id, admin, user, cb) {
        if (admin._id === user._id){
            return cb(new Error("Can not remove itself from a project."))
        }
        return asy.waterfall([
            (next) => {
                return ProjectModel.findById(id, next);
            },
            (project, next) => {
                if (!project) {
                    return next(new Error("The project does not exists and can not be updated"));
                }

                if (!project.isAdmin(admin)) {
                    return next(new Error("This user does not have the rights to remove another user."));
                }

                if (!project.isParticipant(user)) {
                    return next(null, project);
                } else {
                    project.removeParticipant(user);
                    return project.save(next);
                }
            }
        ], cb);
    }

    quit(id, user, cb) {
        return asy.waterfall([
            (next) => {
                return ProjectModel.findById(id, next);
            },
            (project, next) => {
                if (!project) {
                    return next(new Error("the project does not exists"));
                }

                if (!project.isParticipant(user)) {
                    return next(null, project);
                }

                if(project.isAdmin(user)){
                    //If the user is an admin, we must choose another admin.
                    project.removeAdmin(user);
                    project.removeParticipant(user);

                    if (project.hasParticipants()){
                        project.admins.push(project.users[0]);
                    }

                }else{
                    project.removeParticipant(user);
                }

                if (!project.hasAdmins()) {
                    // If the project has no more admins, remove it.
                    return project.remove((err) => {
                        return next(err, project);
                    })
                } else {
                    return project.save((err, project) => {
                        return next(err, project);
                    })
                }
            }

        ], cb);
    }

    read(id, content, cb) {
        return ProjectModel.findById(id, cb);
    }

}

module.exports = new ProjectService();
