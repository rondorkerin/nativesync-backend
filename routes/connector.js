checkauth = require('./checkauth')

module.exports = function(app, passport) {
  app.post('/connector/:service/:function', checkauth, function(req, res) {
    return res.json({hello: 'world'})
  });
}
