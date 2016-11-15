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

  app.post('/action/:service/:function', helpers.checkauth(passport), async (function(req, res) {
    // TODO: look up official actions for the given service with the given function name
    let action = await(Action.findAll({
      where: {
        service_name: req.params['service'],
        function_name: req.params['function']
      }
    }))
    var result = {}
    return res.json({result: result});
  }));
}
