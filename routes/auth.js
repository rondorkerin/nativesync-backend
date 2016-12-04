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


module.exports = function(app, stormpath) {

/*
  app.post('/auth/changePassword',async (function(req, res, next) {
    try{
    var result = await(auth.changePassword(req.token,req.body.oldpass,req.body.newpass))
    }catch(e){
      next(e)
    }
    res.json(result)
  }));
*/

  // app.post('/action/:id', stormpath.checkauth(), async (function(req, res) {
  //   let clientID = req.user.id
  //   let action = await(Action.find(req.params['id']))
  //   let Request = require('../services/request')
  //   output = new Request(client_id, action).send(req.params['input'])
  //   return res.json(output);
  // }));
}
