var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Models = require('../models');
const vm = require('vm');
const request = require('request-promise');

class IntegrationRunner {
  constructor(organization, integration, integrationInstance, integrationCode) {
    this.organization = organization;
    this.integration = integration;
    this.integrationInstance = integrationInstance;
    this.integrationCode = integrationCode;
  }

  run() {
    if (this.integration.type == 'hosted_mvp') {
      this.runHostedMVP();
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
        organization: organization,
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
    const nsUrl = "https://api.nativesync.io/v1";
    var deferred = Promise.defer();
    var organizationApiKey = this.organization.api_key
    var organizationID = this.organization.id;
    var api = {
      ns: function(service, functionName, input) {
        return request.post({
          url: encodeURI(nsUrl + "/action/" + service + "/" + functionName + "/invoke"),
          json: true,
          body: input,
          headers: {
            'Api-Key': organizationApiKey
          }
        });
      },
      set: function(key, value) {
        return Models['OrganizationDatastore'].upsert({organization_id: organizationID, key: key, value: value})
      },
      push: function(key, value) {
        return Models['OrganizationDatastore'].findAll({where: {organization_id: organizationID, key: key}}).then((result) => {
          result.value = result.value.push(value);
          return result.save();
        })
      },
      get: function(key) {
        return Models['OrganizationDatastore'].findAll({where: {organization_id: organizationID, key: key}})
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
