var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, passport) => {

  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });

  var helpers = require('../helpers')(passport);

  require('./internal')(app, helpers);
  require('./v1')(app, helpers);

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
};
