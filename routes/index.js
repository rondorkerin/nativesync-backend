module.exports = function(app) {
  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });
  var helpers = require('../helpers/');

  var auth = require('./auth')(app, helpers);
  var action = require('./action')(app, helpers);
  var integration = require('./integration')(app, helpers);
  var clientAuth = require('./client_auth')(app, helpers);
  var client = require('./client')(app, helpers);
  var service = require('./service')(app, helpers);

}
