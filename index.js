'use strict'
let passport = require('passport');
let config = require('config');

require('use-strict')
var Models = require('./models');
var Auth = require('./services/auth')
var Workers = require('./workers');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
let express = require('express');
var bearerToken = require('express-bearer-token')
var cors = require('cors')
var bodyParser = require('body-parser');

Workers['IntegrationRunner']();

let app = express();

app.set('port', (process.env.PORT || config.get('port')))

let server = require('http').createServer(app).listen(app.get('port'), function(req, res) {
  console.log('running on port', config.get('port'))
});

app.use(passport.initialize())
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())
app.use(bearerToken())

Auth(Models).then(function(auth){
  console.log('loading routes');
  require('./routes')(app,auth);
})

