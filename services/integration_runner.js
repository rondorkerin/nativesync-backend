var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Sandbox = require('sandbox');

class IntegrationRunner {
  constructor(integrationInstance) {
    this.integrationInstance = integrationInstance;
  }

  run() {
    var deferred = Promise.defer();
    Sandbox.run(integrationInstance.code, function(output) {
      deferred.resolve(output)
    })
    return deferred.promise;
  }
}

module.exports = IntegrationRunner
