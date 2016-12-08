var async = require('asyncawait/async');
var await = require('asyncawait/await');

var express = require('express');
module.exports = function(app, helpers) {
  var v1Router = express.Router();
  app.use('/v1', v1Router);

  require('./me')(v1Router, helpers);
  require('./integration')(v1Router, helpers);
  require('./action')(v1Router, helpers);
};
