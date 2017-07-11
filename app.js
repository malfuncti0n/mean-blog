//express framework
var express = require('express');
//path library
var path = require('path');
//usage of favicon
var favicon = require('serve-favicon');
//logger
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//database with objects
var mongoose = require('mongoose');


//routes for diffent endpoints

var appRoutes = require('./routes/app');
var messageRoutes = require('./routes/messages');
var userRoutes = require('./routes/user');

//load custom config from .env
var config = require('dotenv').config();
var app = express();

//connect to database with enviroment variables credentials
var options = {
    user: process.env.DBUSER,
    pass: process.env.DBPASSWORD
}

mongoose.connect(process.env.DBHOST+"/"+process.env.DBNAME, options, function(error){
    console.log(error);
});

// view engine setup. we use template engine only to display the index page. from then angular take over
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

// message api endpoint for angular front end
app.use('/message', messageRoutes);
//user api endpoint for authentication
app.use('/user', userRoutes);
//routes for display the difault error page
app.use('/', appRoutes);


// catch 404 and forward to error handler
//actually we forward them all to index so angular routes work
app.use(function (req, res, next) {
    return res.render('index');
});

module.exports = app;
