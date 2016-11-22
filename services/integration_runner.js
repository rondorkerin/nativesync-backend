var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Models = require('../models');
const vm = require('vm');
const request = require('request-promise');

class IntegrationRunner {
  constructor(client, integration, integrationInstance) {
    this.client = client;
    this.integration = integration;
    this.integrationInstance = integrationInstance;
  }

  run() {
    const nsUrl = "http://nativeapi.herokuapp.com";
    var deferred = Promise.defer();
    var clientApiKey = this.client.api_key
    var clientID = this.client.id;
    var api = {
      ns: function(service, functionName, input) {
        return request.post({
          url: encodeURI(nsUrl + "/action/" + service + "/" + functionName + "/invoke"),
          json: true,
          body: input,
          headers: {
            'X-api-key': clientApiKey
          }
        });
      },
      save: function(key, value) {
        return Models['ClientDatastore'].upsert({client_id: clientID, key: key, value: value})
      },
      get: function(key) {
        return Models['ClientDatastore'].findAll({where: {client_id: clientID, key: key}})
      },
      log: function(message) {
        console.log(message);
      },
      end: function(output) {
        deferred.resolve(output)
      },
    }
    let code = `(function(api) { ${this.integration.code} })()`
    console.log('running code', code);
    vm.runInNewContext(code, api);
    return deferred.promise;
  }
}

module.exports = IntegrationRunner
