'use strict'
let passport = require('passport');
let HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
let config = require('config');

var async = require('asyncawait/async');
var await = require('asyncawait/await');
let express = require('express');
let app = express();
var Client = require('./models/client');

let server = require('http').createServer(app).listen(config.get('port'), function(req, res) {
  console.log('running on port', config.get('port'))
});

app.use(passport.initialize())

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

require('./routes')(app, passport);

passport.use(new HeaderAPIKeyStrategy(
  {header: 'X-Api-Key', prefix: ''},
  false,
  async ((apikey, done) => {
    let client = await (Client.findOne({ where: { api_key: apikey } }))
    if (client) {
      done(null, client);
    } else {
      done('invalid api key');
    }
  })
));
