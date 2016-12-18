var Models = require('../../models');
var Action = Models.Action;
var ActionServiceAuth = Models.ActionServiceAuth;
let ClientAuth = Models.ClientAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

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
    if (req.query.partner_id) {
      where['partner_id'] = req.query.partner_id;
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

      return res.json({action: action, service: service, serviceAuths: serviceAuths});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });

  app.post('/actions/associate_service_auth', helpers.checkauth('user'), function(req, res) {
    let result;
    result = await(ActionServiceAuth.create({action_id: req.body.action_id, service_auth_id: req.body.service_auth_id, verified: false}))
    return res.json(result);
  });
}
