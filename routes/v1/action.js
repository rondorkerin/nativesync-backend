var Models = require('../../models');
var Services = require('../../services');
var Action = Models.Action;
let OrganizationAuth = Models.OrganizationAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {

  app.post('/action/:id/invoke', helpers.checkauth('organization'), (req, res) => {
    let organizationID = req.user.id;
    let action = await(Action.findById(req.params['id']))
    let output = await(new Services.Request(organizationID, action).send(req.body))
    return res.json(output);
  });

  app.post('/action/:service/:function/invoke', helpers.checkauth('organization'), (req, res) => {
    console.log('invoking function', req.params['function']);
    let organizationID = req.user.id;
    let action = await(Action.findOne({ where: {service_name: req.params['service'], function_name: req.params['function']}}))
    let output = await(new Services.Request(organizationID, action).send(req.body))
    return res.json(output);
  });
}
