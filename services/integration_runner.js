var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Sandbox = require('sandbox');

class IntegrationRunner {
  constructor(integration, integrationInstance) {
    this.integration = integration;
    this.integrationInstance = integrationInstance;
  }

  run() {
    var deferred = Promise.defer();
    var sandbox = new Sandbox();
    sandbox.run(this.integration.code, function(output) {
      deferred.resolve(output)
    })
    return deferred.promise;
  }
}

module.exports = IntegrationRunner
