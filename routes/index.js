module.exports = function(app) {
  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });

  var auth = require('./auth')(app);
  var connector = require('./connector')(app);

}
