'use strict'
let passport = require('passport');
var Promise = require('bluebird');
let config = require('config');

require('use-strict')

var async = require('asyncawait/async');
var await = require('asyncawait/await');
let express = require('express');
var bearerToken = require('express-bearer-token')
var cors = require('cors')
var bodyParser = require('body-parser');

let app = express();
app.Models = require('./models');
app.Services = require('./services');
app.Workers = require('./workers');

app.set('port', (process.env.PORT || config.get('port')))

let server = require('http').createServer(app).listen(app.get('port'), function(req, res) {
  console.log('running on port', config.get('port'))
});

app.use(passport.initialize())
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())
app.use(bearerToken())

console.log('loading routes');

if (process.argv[2] == 'workers') {
  app.Workers();
} else {
  require('./routes')(app,passport);
}

