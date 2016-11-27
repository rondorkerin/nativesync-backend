'use strict'
let passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Promise = require('bluebird');
var HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
let config = require('config');

const jwt = require('jwt-simple');
let JWT_SECRET = config.get('jwt_secret');
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

var uuid = require('node-uuid')
var bcrypt = require('bcryptjs')

//Workers['IntegrationRunner']();

let app = express();

app.set('port', (process.env.PORT || config.get('port')))

let server = require('http').createServer(app).listen(app.get('port'), function(req, res) {
  console.log('running on port', config.get('port'))
});

app.use(passport.initialize())
app.use(passport.session());
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())
app.use(bearerToken())

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

var Hash = Promise.promisify(bcrypt.hash)
var Compare  = Promise.promisify(bcrypt.compare)

passport.use('user_login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: true
  },
  async(function(email, password, done) {
    // Auth Check Logic
    var user = await(Models.User.findOne({where: {email: email}}));
    var userSystemAuth = await(Models.UserSystemAuth.findOne({where: {user_id: user.id}}));
    if (Compare(password, userSystemAuth.hash)) {
      userSystemAuth.token = jwt.encode({id: user.id}, JWT_SECRET);
      await(userSystemAuth.save());
      return await(done(null, {token: userSystemAuth.token}));
    }
    return await(done('invalid password', null));
  })
));

passport.use('user', new HeaderApiKeyStrategy({
  header: 'Token' , prefix: ''},
  false,
  async(function(apikey, done) {
    console.log('payload found', apikey);
    var payload = jwt.decode(apikey, JWT_SECRET);
    if (!payload.id) {
      return done('invalid client Token', null);
    } else {
      var user = await(Models.User.findById(payload.id));
      return done(null, user);
    }
  })
));

passport.use('client', new HeaderApiKeyStrategy({
  header: 'Authorization', prefix: 'Api-Key ' },
  false,
  async(function(apikey, done) {
    var client = await(Models.Client.findOne({where: {api_key: apikey}}));
    if (!client) {
      return done('invalid client API key', null);
    }
    return done(null, client);
  })
));

console.log('loading routes');
require('./routes')(app,passport);

