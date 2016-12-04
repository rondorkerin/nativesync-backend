let ClientAuth = require('../models/client_auth');

module.exports = (app, stormpath) => {
  app.post('/auth_credentials', stormpath.loginRequired, (req, res) => {
    var credentials = req.body.credentials;
    credentials.client_id = req.user.id;
    return ClientAuth.create(credentials).then((results) => {
      return res.json({success: true});
    })
  });

  app.get('/auth_credentials', stormpath.loginRequired, (req, res) => {
    return ClientAuth.findAll({where: {client_id: req.user.id}}).then((results) => {
      return res.json(results);
    })
  });

  app.get('/auth_credentials/:service', stormpath.loginRequired, (req, res) => {
    return ClientAuth._getAllForService(req.user.id, req.params['service']).then((results) => {
      return res.json(results);
    })
  });
}
