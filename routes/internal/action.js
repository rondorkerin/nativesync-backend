var Models = require('../../models');
var Action = Models.Action;
let ClientAuth = Models.ClientAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, helpers) {

  app.get('/actions', async(function(req, res) {
    let actions = await(Action.findAll({limit: 50}))
    return res.json(actions);
  }));

  app.get('/me/actions', async(function(req, res) {
    let actions = await(Action.findAll({where: {partner_id: req.partner.id}}))
    return res.json(actions);
  }));

}
