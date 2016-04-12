# Hapi-Swagger Demo with JavaScript
### 1.Modify package.json
```sh
{
  "name": "swagger-nodejs",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "main":"app.js",
  "dependencies": {
    "body-parser": "~1.13.2",
    "cookie-parser": "~1.3.5",
    "debug": "~2.2.0",
    "express": "~4.13.1",
    "jade": "~1.11.0",
    "morgan": "~1.6.1",
    "serve-favicon": "~2.3.0",
    "good-console": "^5.0.0",
    "hapi": "^8.5.1",
    "hapi-swagger": "0.7.3",
    "joi": "^6.4.2",
    "mysql":"^2.10.2"
  }
}
```
## 2.Edit app.js
create server
```sh
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
// =============== Start our Server =======================
// Lets start the server
server.start(function () {
  console.log('Server running at:', server.info.uri);
});
```
create database connection
```sh
var client = mysql.createConnection({
  host:'localhost',
  user:'root',
  password: '123456',
  port:'3306'
});
client.connect();
client.query('USE strongtest');
```
edit server route
```sh
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
```
## 3.Start Server and explore localhost:7002/documentation

## 4.References
[Build RESTful API Using Node and Hapi](http://www.tothenew.com/blog/build-restful-api-using-node-and-hapi/)

[Swagger for Express and Node.js](https://c9.io/tobiashutterer/swagger-node-express)

[Hapi-swagger](https://www.npmjs.com/package/hapi-swagger)

[hapi.js: API documentation and validation with joi and swagger](http://gitkitty.com/2015/02/06/hapijs-with-joi/)


