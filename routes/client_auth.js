let ClientAuth = require('../models/client_auth');

module.exports = function(app, passport, helpers) {
  app.post('/clientAuth', helpers.checkauth(passport), function(req, res) {
    var clientID = helpers.clientID(req);
    var auth = req.body.auth;
    auth.clientID = clientID;
    return ClientAuth.upsert(clientAuth)
    .then(function(results) {
      return res.json({success: true});
    })
  });

  app.get('/clientAuths', helpers.checkauth(passport), function(req, res) {
    var clientID = helpers.clientID(req);
    return ClientAuth.getAllForClient(clientID)
    .then(function(results) {
      return res.json(results);
    })
  });
}
