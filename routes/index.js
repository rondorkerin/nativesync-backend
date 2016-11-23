module.exports = function(app,auth) {
  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });

  var helpers = require('../helpers/');

  require('./auth')(app, helpers,auth);
  require('./action')(app, helpers);
  require('./integration')(app, helpers);
  require('./client_auth')(app, helpers);
  require('./client')(app, helpers);
  require('./service')(app, helpers);

}
