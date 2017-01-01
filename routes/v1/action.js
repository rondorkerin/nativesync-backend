var Models = require('../../models');
var Services = require('../../services');
var Action = Models.Action;
let OrganizationAuth = Models.OrganizationAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {

  app.post('/action/invoke', helpers.checkauth('organization'), (req, res) => {
    let actionObject = req.body;
    let action;
    if (actionObject.id) {
      action = await(Action.findById(actionObject.id))
    } else {
      var where = {
        service_name: actionBody.service_name,
        function_name: actionBody.function_name,
        organization_name: actionBody.org_name
      };
      if (actionBody.version) {
        where.version = actionBody.version;
      }
      action = await(Action.findOne({where: where}));
    }
    let organization = req.user;
    let output = await(new Services.Request(organization, action).send(req.body))
    return res.json(output);
  });
}
