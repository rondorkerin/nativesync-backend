var checkauth = require('../helpers/checkauth')
var Action = require('../models/action')
let ClientAuth = require('../models/client_auth');
var Promise = require('bluebird');
var Models = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var uuid = require('node-uuid')
var bcrypt = require('bcryptjs')
var Hash = Promise.promisify(bcrypt.hash)
var Compare  = Promise.promisify(bcrypt.compare)


module.exports = function(app, helpers) {

  //anyone can access this route
  app.post('/auth/signup', async (function(req, res, next) {
    var password = req.body.password;
    var email = req.body.email;
    var user = await(Models.User.create({email: email, password: password}));
    if (user) {
      var hash = await(Hash(password,10));
      var userSystemAuth = await(Models.UserSystemAuth.create({user_id: user.id, hash: hash}));
    }
    res.json(user)
  }));

  app.get('/auth/testsignup', async (function(req, res, next) {
    var password = 'fourtwo'
    var email = 'nick'
    try {
      var user = await(Models.User.create({email: email, password: password}));
    } catch(e) {
      return res.status(500).send('email is already taken');
    }
    var hash = await(Hash(password,10));
    var userSystemAuth = await(Models.UserSystemAuth.create({user_id: user.id, hash: hash}));
    return res.json(user)
  }));

  //anyone can access this route
  app.post('/auth/login', helpers.checkauth('user_login'), async (function(req, res, next) {
    return res.json(req.user);
  }));

  app.get('/auth/failure', function(req, res, next) {
    res.send('Failed to authenticate (are you missing an API key?)');
  });

  app.get('/auth/success', function(req, res, next) {
    return res.json(req.user);
  });

  app.post('/auth/logout', async (function(req, res) {
    var result = await(auth.logout(req.token))
    res.json(result)
  }));

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
