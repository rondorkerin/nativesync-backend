'use strict';
// var async = require('asyncawait/async');
// var await = require('asyncawait/await');
var express = require('express');

module.exports = function(app, helpers) {
  var internalRouter = express.Router();
  app.use('/internal', internalRouter);

  require('./action')(internalRouter, helpers);
  require('./auth')(internalRouter, helpers);
  require('./integration')(internalRouter, helpers);
  require('./integration_request')(internalRouter, helpers);
  require('./marketplace')(internalRouter, helpers);
  require('./me')(internalRouter, helpers);
  require('./organization')(internalRouter, helpers);
  require('./organization_auth')(internalRouter, helpers);
  require('./service')(internalRouter, helpers);
  require('./service_auth')(internalRouter, helpers);
  require('./service_definition')(internalRouter, helpers);
};
