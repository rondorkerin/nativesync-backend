var async = require('asyncawait/async');
var await = require('asyncawait/await');
var express = require('express');
var fs = require('fs');

module.exports = function(app, helpers) {
  var docsRouter = express.Router();
  app.use('/docs', docsRouter);

	// allow CORS
	docsRouter.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

  docsRouter.get('/swagger.json', async ((req, res, next) => {
    var swaggerJson = fs.readFileSync('./docs/swagger.json', {encoding: 'utf8'});
    return res.send(swaggerJson);
  }));
};
