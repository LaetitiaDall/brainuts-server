var express = require('express'),
    app = express(),
    port = 22551,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    io = require('socket.io'),
    cors = require('cors');

require("./api/utils/extensions");

var helmet = require('helmet');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/brainuts', {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
});


app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

var UserModel = require('./api/user/model/UserModel'),
    NoteModel = require('./api/note/model/NoteModel');


var UserRoutes = require('./api/user/route/UserRoutes'),
    NoteRoutes = require('./api/note/route/NoteRoutes');
    UserService = require('./api/user/service/UserService');

UserRoutes(app);
NoteRoutes(app);

UserService.createUser('test', '1234');


var server = app.listen(port);
console.log('brainut server started on: ' + port);
