let ConnectorService = require('../services/connector');
checkauth = require('./checkauth')

module.exports = function(app, passport) {
  app.post('/connector/:service/:function', checkauth(passport), function(req, res) {
    console.log('body', req.body);
    let service = req.params['service'];
    let functionName = req.params['function'];
    debugger;
    return new ConnectorService({}).call(service, functionName, req.body)
    .then(function(result) {
      return res.json({result: result});
    })
    .catch(function(error) {
      return res.json({error: error});
    });
  });
}
