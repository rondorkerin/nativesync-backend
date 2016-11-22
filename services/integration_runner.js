var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const request = require('request-promise');
const jailed = require('jailed');
var fs = require("fs");

class IntegrationRunner {
  constructor(client, integration, integrationInstance) {
    this.client = client;
    this.integration = integration;
    this.integrationInstance = integrationInstance;
  }

  run() {
    const nsUrl = "nativeapi.herokuapp.com";
    var deferred = Promise.defer();
    var api = {
      ns: function(action_id, input) {
        return request.post({
          url: nsUrl + "/action/" + action_id,
          json: input,
          headers: {
            'X-api-key': this.client.api_key
          }
        })
      },
      end: function(output) {
        deferred.resolve(output)
      }
    }
    var plugin = new jailed.DynamicPlugin(this.integration.code, api);
    // plugin.whenConnected()
    //  deferred.resolve(output)
    return deferred.promise;
  }
}

module.exports = IntegrationRunner
