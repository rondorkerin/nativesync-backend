var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Sandbox = require('sandbox');

class IntegrationRunner {
  constructor(client, integration, integrationInstance) {
    this.client = client;
    this.integration = integration;
    this.integrationInstance = integrationInstance;
  }

  run() {
    var deferred = Promise.defer();
    var sandbox = new Sandbox();
    const nsUrl = "nativeapi.herokuapp.com";
    var prepend = `const request = require('request-promise');
                   const ns = function(action_id, input) {
                     return request.post({
                       url: "${nsUrl}/action/" + action_id,
                       json: input,
                       headers: {
                         'X-api-key': '${this.client.api_key}'
                       }
                     })
                   };`
    let code = prepend + " " + this.integration.code;
    sandbox.run(code, function(output) {
      deferred.resolve(output)
    })
    return deferred.promise;
  }
}

module.exports = IntegrationRunner
