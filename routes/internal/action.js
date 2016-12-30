var Models = require('../../models');
var Action = Models.Action;
var ActionServiceAuth = Models.ActionServiceAuth;
let OrganizationAuth = Models.OrganizationAuth;
var Request = require('../../services/request');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var _ = require('underscore');

module.exports = function(app, helpers) {

  app.get('/action/:id', helpers.checkauth('user'), function(req, res) {
    let action = await(Action.findById(req.params.id))
    let serviceAuths = await(action.getServiceAuths());
    let service = await(action.getService());
    return res.json({action: action, serviceAuths: serviceAuths, service: service});
  });

  app.get('/actions', helpers.checkauth('user'), function(req, res) {
    let where = {}
    if (req.query.service_id) {
      where['service_id'] = req.query.service_id;
    }
    if (req.query.service_ids) {
      where['service_id'] = { '$in' : req.query.service_ids };
    }
    if (req.query.organization_id) {
      where['organization_id'] = req.query.organization_id;
    }
    let limit = req.query.limit ? req.query.limit : 50;
    let actions = await(Action.findAll({where: where, limit: limit}))
    return res.json(actions);
  });

  app.post('/actions/upsert', helpers.checkauth('user'), function(req, res) {
    let result;
    let action = req.body.action;
    let service = req.body.service;
    let serviceAuthIDs = _.pluck(req.body.serviceAuths, 'id');
    let existingServiceAuths = [];

    // associate the action with a service
    action.service_id = service.id;
    try {
      if (action.id) {
        await(Action.update(action, {where: {id: action.id}}))
        action = await(Action.findById(action.id));
      } else {
        action = await(Action.create(action))
      }

      console.log('associating', serviceAuthIDs);
      await(action.setServiceAuths(serviceAuthIDs));

      var serviceAuths = await(action.getServiceAuths());
      return res.json({action: action, service: service, serviceAuths: serviceAuths});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });

  app.post('/actions/test', helpers.checkauth('user'), function(req, res) {
    let action = await(Action.findById(req.body.id));
    let organization = await(Models.Organization.findById(req.body.organizationId));
    let input = req.body.input;
    let request = Request.new(organization, action);
    let output = await(request.send(input))
    return res.json(output);
  });

  app.post('/actions/associate_service_auth', helpers.checkauth('user'), function(req, res) {
    let result;
    result = await(ActionServiceAuth.create({action_id: req.body.action_id, service_auth_id: req.body.service_auth_id, verified: false}))
    return res.json(result);
  });
}
