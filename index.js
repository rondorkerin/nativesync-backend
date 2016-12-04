'use strict'
var Promise = require('bluebird');
var config = require('config');
require('use-strict')
var Models = require('./models');
var Auth = require('./services/auth')
var Workers = require('./workers');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var express = require('express');
var cors = require('cors')
var stormpath = require('express-stormpath');

let app = express();
app.use(stormpath.init(app, {
  // Optional configuration options.
}));

app.set('port', (process.env.PORT || config.get('port')))
app.listen();

console.log('loading routes');
// Stormpath will let you know when it's ready to start authenticating users.
app.on('stormpath.ready', function () {
  console.log('Stormpath Ready!');
/*
  if (process.argv[2] == 'workers') {
    Workers['IntegrationRunner']();
  } else {
    require('./routes')(app, stormpath);
  }
*/
});


