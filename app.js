var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mysql = require('mysql');
var Joi = require('joi');

var client = mysql.createConnection({
  host:'localhost',
  user:'root',
  password: '123456',
  port:'3306'
});
client.connect();
client.query('USE strongtest');


//Include Hapi package
var Hapi = require('hapi');


// Create Server Object
var server = new Hapi.Server();

// Define PORT number
server.connection({port: 7002});

// Register Swagger Plugin ( Use for documentation and testing purpose )
server.register({
  register: require('hapi-swagger'),
  options: {
    apiVersion: "0.0.1"
  }
}, function (err) {
  if (err) {
    server.log(['error'], 'hapi-swagger load error: ' + err)
  } else {
    server.log(['start'], 'hapi-swagger interface loaded')
  }
});
// =============== Routes for our API =======================
// Define GET route
server.route({
  method: 'GET',      // Methods Type
  path: '/api/user',  // Url
  config: {
    // Include this API in swagger documentation
    tags: ['api'],
    description: 'Get All User data',
    notes: 'Get All User data'
  },
  handler: function (request, reply) { //Action
    client.query('SELECT * FROM '+ 'users', function select(err, results, fields) {
      if (err) {
        reply({
          statusCode: 503,
          message: 'Getting All User Data Failed',
          data: err
        });
        throw err;
      }
      if (results) {
        reply({
          statusCode: 200,
          message: 'Getting All User Data',
          data: results
        });
      }
    });
  }
});
server.route({
  method: 'POST',      // Methods Type
  path: '/api/addUser',  // Url
  config: {
    // Include this API in swagger documentation
    tags: ['api'],
    description: 'Add A New User',
    notes: 'Add A New User',
    validate: {
      payload: {
        name: Joi.string().required().description('User\'s name'),
        password: Joi.string().required().description('User\'s password')
      }
    }
  },
  handler: function (request, reply) { //Action
    var addSql = 'INSERT INTO users(name, password) VALUES(?,?)';
    var addSql_Params = [request.payload.name, request.payload.password];
    client.query(addSql, addSql_Params, function select(err, results, fields) {
      if (err) {
        reply({
          statusCode: 503,
          message: 'Adding New User Data Failed',
          data: err
        });
        throw err;
      }
      if (results) {
        reply({
          statusCode: 200,
          message: 'Adding New User Data Succeed'
        });
      }
    });
  }
});
server.route({
  method: 'GET',      // Methods Type
  path: '/api/getUser/{id}',  // Url
  config: {
    // Include this API in swagger documentation
    tags: ['api'],
    description: 'Get User By Id',
    notes: 'Get User By Id',
    validate: {
      params: {
        id: Joi.number().required().description('User\'s Id')
      }
    }
  },
  handler: function (request, reply) { //Action
    // var addSql = 'INSERT INTO users(name, password) VALUES(?,?)';
    // var addSql_Params = [request.params.name, request.params.password];
    client.query("SELECT * FROM users WHERE id = " + request.params.id, function select(err, results, fields) {
      if (err) {
        reply({
          statusCode: 503,
          message: 'Get User Data Failed',
          data: err
        });
        throw err;
      }
      if (results) {
        reply({
          statusCode: 200,
          message: 'Getting User Data Succeed',
          data: results
        });
      }
    });
  }
});
// =============== Start our Server =======================
// Lets start the server
server.start(function () {
  console.log('Server running at:', server.info.uri);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
