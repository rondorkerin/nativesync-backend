var Models = require('../../models');
var Action = Models.Action;
let ClientAuth = Models.ClientAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, helpers) {

  app.get('/actions', helpers.checkauth('user'), async(function(req, res) {
    let actions = await(Action.findAll({limit: 50}))
    return res.json(actions);
  }));

}
