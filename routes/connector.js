checkauth = require('../helpers/checkauth')
var Connector = require('../models/connector')
let ClientAuth = require('../models/client_auth');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, passport, helpers) {

  app.get('/connectors', async (function(req, res) {
    let connectors = await(Connector.findAll())
    return res.json(connectors);
  }));

  app.post('/connector/:id', helpers.checkauth(passport), async (function(req, res) {
    // TODO: look up official connectors for the given service with the given function name
    let connector = await(Connector.find(req.params['id']))
    var result = {}
    return res.json({result: result});
  }));

  app.post('/connector/:service/:function', helpers.checkauth(passport), async (function(req, res) {
    // TODO: look up official connectors for the given service with the given function name
    let connector = await(Connector.findAll({
      where: {
        service_name: req.params['service'],
        function_name: req.params['function']
      }
    }))
    var result = {}
    return res.json({result: result});
  }));
}
