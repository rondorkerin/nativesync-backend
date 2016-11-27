module.exports = function(app, auth, clientAuth) {
  app.get('/test', function(req, res) {
    res.json({ping: 'pong'});
  });

  // middleware for attaching user, all routes after this
  // can assume if no req.user specified they are not logged in
  app.use(async(function(req,res,next){
    try{
      req.user = await(auth.validate(req.token))
      if (!req.user) {
        var clientSystemAuth = await(Models['ClientSystemAuth'].findOne({where: {token: req.token}}))
				if (clientSystemAuth) {
					req.client = await(clientSystemAuth.getClient());
				}
      }
    } catch(e) {
			console.log('login fail', e);
    }
    next()
  }))

  var helpers = require('../helpers');

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
    console.log(err)
    res.status(500).send(err.message || err)
  })
}
