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

  app.post('/me/partner_login', helpers.checkauth('user'), (req, res) => {
    var partners = await(req.user.getPartners({where: {id: req.body.partner_id}}));
    if (partners.length == 1) {
      req.session.partner_id = req.body.partner_id;
    }
    return res.json({});
  });

  app.post('/me/client_login', helpers.checkauth('user'), (req, res) => {
    var client_id = await(req.user.getClients({where: {id: req.body.client_id}}));
    if (client_id.length == 1) {
      req.session.client_id = req.body.client_id;
    }
    return res.json({});
  });
}
