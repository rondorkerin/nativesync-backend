let await = require('asyncawait/await');
let async = require('asyncawait/async');
var Models = require('../../models')
var Organization = Models.Organization;
var User = Models;

module.exports = (app, helpers) => {
  app.get('/me', helpers.checkauth('user'), (req, res) => {
    return res.json(req.user);
  });

  app.get('/me/associations', helpers.checkauth('user'), (req, res) => {
    var organizations = await(req.user.getOrganizations());
    return res.json({organizations: organizations});
  });
}
