'use strict'
var Models = require('../../models');
var Services = require('../../services');
var Action = Models.Action;
let OrganizationAuth = Models.OrganizationAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {

  app.post('/action/invoke', helpers.checkauth('organization'), (req, res) => {
    let actionIdentifier = req.body.action;
    let action;
    if (actionIdentifier.id) {
      action = await(Action.findById(actionObject.id))
    } else {
      var where = { internal_name: actionIdentifier.internal_name };
      action = await(Action.findOne({where: where}));
    }
    let organization = req.user;
    let response = await(new Services.Request(organization, action).send(req.body.input))
    return res.json(response);
  });
}
