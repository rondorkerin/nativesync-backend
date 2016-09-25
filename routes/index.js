module.exports = function(app, passport) {
  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });

  var connector = require('./connector')(app, passport);

}
