let await = require('asyncawait/await');
let async = require('asyncawait/async');
var Models = require('../../models')
var Partner = Models.Partner;
var Client = Models.Client;
var User = Models;

module.exports = (app, helpers) => {
  app.get('/me', helpers.checkauth('user'), (req, res) => {
    return res.json(req.user);
  });

  app.get('/me/associations', helpers.checkauth('user'), (req, res) => {
    var partners = await(req.user.getPartners());
    var clients = await(req.user.getClients());
    return res.json({clients: clients, partners: partners});
  });
}
