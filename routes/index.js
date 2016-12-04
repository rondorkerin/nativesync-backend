var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = async(function(app, stormpath) {

  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });

  require('./auth')(app, stormpath);
  require('./me')(app, stormpath);
  require('./action')(app, stormpath);
  require('./integration')(app, stormpath);
  require('./client_auth')(app, stormpath);
  require('./client')(app, stormpath);
  require('./service')(app, stormpath);

  //404 handler
  app.use(function(req,res,next){
    res.status(404).send('resource not found: ' + req.path)
  })

  //default error handler, needs to be last middleware in stack
  //throw errors to be caught here by calling "next('error')" in your route.
  app.use(function(err,req,res,next){
    console.log(err)
    res.status(500).send(err.message || err)
  })
});
