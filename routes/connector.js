let ConnectorService = require('../services/connector');
let ClientAuth = require('../models/client_auth');
checkauth = require('../helpers/checkauth')

module.exports = function(app, passport, helpers) {
  app.post('/connector/:service/:function', helpers.checkauth(passport), function(req, res) {
    console.log('body', req.body);
    let service = req.params['service'];
    let functionName = req.params['function'];
    return ClientAuth.getForClient(helpers.clientID(req), service)
    .then(function(clientAuth) {
      debugger;
      return new ConnectorService(clientAuth).call(service, functionName, req.body)
    })
    .then(function(result) {
      debugger;
      return res.json({result: result});
    })
    .catch(function(error) {
      return res.json({error: error});
    });
  });
}
