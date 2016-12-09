var Models = require('../../models');
var Action = Models.Action;
var ActionServiceAuth = Models.ActionServiceAuth;
let ClientAuth = Models.ClientAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, helpers) {

  app.get('/actions', helpers.checkauth('user'), async(function(req, res) {
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
  }));

  app.post('/actions', helpers.checkauth('user'), async(function(req, res) {
    let result;
    if (req.body.id) {
      await(Action.update(req.body, {where: {id: req.body.id}}))
      result = await(Action.findById(req.body.id));
    } else {
      result = await(Action.create(req.body))
    }
    return res.json(result);
  }));

  app.post('/actions/associate_service_auth', helpers.checkauth('user'), async(function(req, res) {
    let result;
    result = await(ActionServiceAuth.create({action_id: req.body.action_id, service_auth_id: req.body.service_auth_id, verified: false})
    return res.json(result);
  }));
}
