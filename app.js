var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql = require('mysql');
var myConnection = require('express-myconnection');
var config = require('./config');
var params = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  database: config.database.db,
};
var app = express();

var index = require('./routes/index');
var book = require('./routes/book');
var emprunteur = require('./routes/emprunteur');
var emprunter = require('./routes/emprunter');

app.use(myConnection(mysql, params, 'pool'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/book', book);
app.use('/emprunteur', emprunteur);
app.use('/emprunter', emprunter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(8080, function() {
  console.log('serveur en attente');
});

module.exports = app;
