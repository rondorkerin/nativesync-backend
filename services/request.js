var SwaggerParser = require('swagger-parser');
var Connector = require('../../../models/connector');
var Service = require('../../../models/service');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

class Request { 
  constructor(connector) { this.connector = connector; }

  send(input) {
    return input;
  }
}

module.exports = SwaggerCompiler
