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
    var path = "/tmp/script.js"
    fs.writeFileSync(path, this.integration.code);
    const nsUrl = "nativeapi.herokuapp.com";
    var api = {
      ns: function(action_id, input) {
         return request.post({
           url: nsUrl + "/action/" + action_id,
           json: input,
           headers: {
             'X-api-key': this.client.api_key
           }
         })
       }
    }
    var deferred = Promise.defer();
    var plugin = new jailed.Plugin(path, api);
    // plugin.whenConnected()
    //  deferred.resolve(output)
    return deferred.promise;
  }
}

module.exports = IntegrationRunner
