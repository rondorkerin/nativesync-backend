const Models = require('../../models')
const Action = Models.Action
const ClientAuth = Models.ClientAuth
const Promise = require('bluebird');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const uuid = require('node-uuid')
const bcrypt = require('bcryptjs')
const Hash = Promise.promisify(bcrypt.hash)
const Compare  = Promise.promisify(bcrypt.compare)
const jwt = require('jwt-simple');
const HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const config = require('config');
const JWT_SECRET = config.get('jwt_secret');

module.exports = function(app, helpers) {
  helpers.passport.use('user', new HeaderApiKeyStrategy({
    header: 'Token' , prefix: '', session: false},
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

  //anyone can access this route
  app.post('/auth/signup', async (function(req, res, next) {
    var password = req.body.password;
    var email = req.body.email;
    var user = await(Models.User.create({email: email, password: password}));
    if (user) {
      var hash = await(Hash(password,10));
      var userSystemAuth = await(Models.UserSystemAuth.create({user_id: user.id, hash: hash}));
    }
    return res.json(user)
  }));

  //anyone can access this route
  app.post('/auth/login', async(function(req, res, next) {
    var password = req.body.password;
    var email = req.body.email;
    var user = await(Models.User.findOne({where: {email: email}}));
    var userSystemAuth = await(Models.UserSystemAuth.findOne({where: {user_id: user.id}}));
    if (Compare(password, userSystemAuth.hash)) {
      userSystemAuth.token = jwt.encode({id: user.id}, JWT_SECRET);
      await(userSystemAuth.save());
      return res.json({token: userSystemAuth.token});
    }
    return res.status(401).send('invalid credentials');
  }));

  app.get('/auth/failure', function(req, res, next) {
    res.send('Failed to authenticate (are you missing an API key?)');
  });

  app.post('/auth/logout', helpers.checkauth('user'), function(req, res) {
    console.log('logout called for user', req.user);
    var systemAuth = await(Models.UserSystemAuth.findOne({where: {user_id: req.user.id}}))
    systemAuth.token = '';
    await(systemAuth.save());
    return res.send('success');
  });

  app.post('/auth/user',function(req,res){
    res.json(req.user)
  })

  app.post('/auth/changePassword',async (function(req, res, next) {
    try{
    var result = await(auth.changePassword(req.token,req.body.oldpass,req.body.newpass))
    }catch(e){
      next(e)
    }
    res.json(result)
  }));

  // app.post('/action/:id', helpers.checkauth(), async (function(req, res) {
  //   let clientID = req.user.id
  //   let action = await(Action.find(req.params['id']))
  //   let Request = require('../services/request')
  //   output = new Request(client_id, action).send(req.params['input'])
  //   return res.json(output);
  // }));
}
