var checkauth = require('../helpers/checkauth')
var Action = require('../models/action')
let ClientAuth = require('../models/client_auth');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, helpers) {

  app.get('/auth/signup', async (function(req, res) {
    let actions = await(Action.findAll())
    return res.json(actions);
  }));
}
