var async = require('asyncawait/async');
var await = require('asyncawait/await');
var express = require('express');

module.exports = function(app, helpers) {
  var internalRouter = express.Router();
  app.use('/internal', internalRouter);

  require('./auth')(internalRouter, helpers);
  require('./me')(internalRouter, helpers);
  require('./action')(internalRouter, helpers);
  require('./integration')(internalRouter, helpers);
  require('./client_auth')(internalRouter, helpers);
  require('./client')(internalRouter, helpers);
  require('./partner')(internalRouter, helpers);
  require('./service')(internalRouter, helpers);
  require('./service_auth')(internalRouter, helpers);
};
