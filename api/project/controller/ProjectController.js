'use strict';

var mongoose = require('mongoose');
var ProjectModel = mongoose.model('Project');
var ProjectService = require('../service/ProjectService');

class ProjectController {


    listAll(req, res) {
        ProjectModel.find({}, (err, projects) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(projects);
        });
    };

    read(req, res) {
        ProjectService.read(req.params.id, (err, project) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(project);
        });
    };

    addUser(req, res) {
        ProjectService.addAnotherUser(req.params.id, req.body, (err, project) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(project);
            }
        });
    };

    removeUser(req, res) {
        ProjectService.removeAnotherUser(req.params.id, req.body, (err, project) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(project);
            }
        });
    };

    update(req, res) {
        ProjectService.update(req.params.id, req.body, (err, project) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(project);
            }
        });
    };

    quit(req, res) {
        ProjectService.quit(req.params.id, (err, project) => {
            if (err)
                res.status(500).send(err);
            else
                res.json(project);
        });
    };

}

module.exports = new ProjectController();
