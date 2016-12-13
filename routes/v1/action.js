var Models = require('../../models');
var Services = require('../../services');
var Action = Models.Action;
let ClientAuth = Models.ClientAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {

  app.post('/action/:id/invoke', helpers.checkauth('client'), async((req, res) => {
    let clientID = req.user.id;
    let action = await(Action.findById(req.params['id']))
    let output = await(new Services.Request(clientID, action).send(req.body))
    return res.json(output);
  }));

  app.post('/action/:service/:function/invoke', helpers.checkauth('client'), (req, res) => {
    console.log('invoking function', req.params['function']);
    let clientID = req.user.id;
    let action = await(Action.findOne({ where: {service_name: req.params['service'], function_name: req.params['function']}}))
    let output = await(new Services.Request(clientID, action).send(req.body))
    return res.json(output);
  });
}
