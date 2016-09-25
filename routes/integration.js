let Integration = require('../models/integration');

module.exports = function(app, passport, helpers) {
  app.post('/integration', helpers.checkauth(passport), function(req, res) {
    var clientID = helpers.clientID(req);
    var integration = req.body.integration;
    integration.clientID = clientID;
    return Integration.upsert(integration)
    .then(function(results) {
      return res.json({success: true});
    })
  });

  app.get('/integrations', helpers.checkauth(passport), function(req, res) {
    var clientID = helpers.clientID(req);
    return Integration.getAllForClient(clientID)
    .then(function(results) {
      return res.json(results);
    })
  });
}
