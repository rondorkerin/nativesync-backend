var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Models = require('../models');
const vm = require('vm');
const request = require('request-promise');

class IntegrationRunner {
  constructor(client, integration, integrationInstance, integrationCode) {
    this.client = client;
    this.integration = integration;
    this.integrationInstance = integrationInstance;
    this.integrationCode = integrationCode;
  }

  run() {
    if (this.integration.type == 'hosted_mvp') {
      this.runHostedMVP();
    } else if (this.integration.type == 'lambda') {
      this.runLambda();
    } else if (this.integration.type == 'external') {
      this.runExternal();
    }
  }

  runExternal() {
    let url = this.integrationCode.code;
    return request.post({
      url: url,
      json: true,
      body: {
        client: client,
        integration: this.integration,
        integrationInstance: this.integrationInstance,
        integrationCode: this.integrationCode
      },
    });

  }

  runLambda() {
    throw 'not implemented';
  }

  runHostedMVP() {
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
      set: function(key, value) {
        return Models['ClientDatastore'].upsert({client_id: clientID, key: key, value: value})
      },
      push: function(key, value) {
        return Models['ClientDatastore'].findAll({where: {client_id: clientID, key: key}}).then((result) => {
          result.value = result.value.push(value);
          return result.save();
        })
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
    let code = `(function(api) { ${this.integrationCode.code} })()`
    console.log('running code', code);
    vm.runInNewContext(code, api);
    return deferred.promise;
  }
}

module.exports = IntegrationRunner
