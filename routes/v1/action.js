var Models = require('../../models');
var Services = require('../../services');
var Action = Models.Action;
let ClientAuth = Models.ClientAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, helpers) {

  app.post('/action/:id/invoke', async(function(req, res) {
    let clientID = req.user.id;
    let action = await(Action.findById(req.params['id']))
    let output = new Services.Request(clientID, action).send(req.body)
    return res.json(output);
  }));

  app.post('/action/:service/:function/invoke', async(function(req, res) {
    let clientID = req.user.id;
    let action = await(Action.findOne({ where: {service_name: req.params['service'], function_name: req.params['function']}}))
    let output = new Services.Request(clientID, action).send(req.body)
    return res.json(output);
  }));
}
