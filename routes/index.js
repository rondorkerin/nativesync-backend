module.exports = function(app, passport) {
  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });
  var helpers = require('../helpers/');

  var action = require('./action')(app, passport, helpers);
  var integration = require('./integration')(app, passport, helpers);
  var clientAuth = require('./client_auth')(app, passport, helpers);
  var client = require('./client')(app, passport, helpers);
  var service = require('./service')(app, passport, helpers);

}
