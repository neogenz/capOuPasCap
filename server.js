// set up ========================================================================================================
// get all the tools we need
var express = require("express");
var app = express();
var port = 5000;
var http = require("http");

var morgan = require("morgan");
var model = require("./model");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var cors = require("cors");

// configuration ==============================================================
app.set('port', process.env.PORT || port);
process.env.JWT_SECRET = "applicationcapoupascap";

app.use(bodyParser.json({limit: '50mb'})); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));

// options ====================================================================
app.use(morgan('dev')); // log every request to the console
app.use(cors({credentials: true, origin: true}));

// models init =================================================================
model.sequelize.sync(/*{force: true}*/).then(function () {
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
        require('./route')(app, model, jwt);
        require(__dirname + "/DAL/Challenge")(app, model, jwt);
        require(__dirname + "/DAL/User")(app, model, jwt);
    });
});