var checkauth = require('../helpers/checkauth')
var Action = require('../models/action')
let ClientAuth = require('../models/client_auth');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, helpers,auth) {


  //anyone can access this route
  app.post('/auth/signup', async (function(req, res, next) {
    try{
      var user = await(auth.signup(req.body.email,req.body.password))
      res.json(user)
    }catch(e){
      next(e)
    }
  }));

  //anyone can access this route
  app.post('/auth/login', async (function(req, res, next) {
    try{
      var token = await(auth.login(req.body.email,req.body.password))
      res.json(token)
    }catch(e){
      next(e)
    }
  }));

  //middleware for attaching user, all routes after this 
  //can assume if no req.user specified they are not logged in
  app.use(async(function(req,res,next){
    try{
      req.user = await(auth.validate(req.token))
    }catch(e){
      next(e)
    }
  }))

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
