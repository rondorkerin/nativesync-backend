var checkauth = require('../helpers/checkauth')
var Action = require('../models/action')
let ClientAuth = require('../models/client_auth');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, passport, helpers) {

  app.get('/actions', async (function(req, res) {
    let actions = await(Action.findAll())
    return res.json(actions);
  }));

  app.post('/action/:id', helpers.checkauth(passport), async (function(req, res) {
    let action = await(Action.find(req.params['id']))
    let Request = require(`../services/request`)
    output = Request.new(action).send(req.params['input'])
    return res.json(output);
  }));
}
