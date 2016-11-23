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

  //404 handler
  app.use(function(req,res,next){
    res.status(404).send('resource not found: ' + req.path)
  })

  //default error handler, needs to be last middleware in stack
  //throw errors to be caught here by calling "next('error')" in your route.
  app.use(function(err,req,res,next){
    console.log('err:' +  err.message || err)
    res.status(500).send(err.message || err)
  })
}
