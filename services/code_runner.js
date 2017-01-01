var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Models = require('../models');
const vm = require('vm');
const request = require('request-promise');

class CodeRunner {
  constructor(organization, code, variables) {
    this.organization = organization;
    this.code = code;
    this.variables = variables;
  }

  run(options) {
    if (!options) { options = {} }
    const nsUrl = "https://api.nativesync.io/v1";
    var deferred = Promise.defer();
    var organizationApiKey = this.organization.api_key
    var organizationID = this.organization.id;
    var logs = [];
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
        if (options.loggingEnabled) {
          logs.push(message);
        }
      },
      end: function(output) {
        if (options.loggingEnabled) {
          var result = {logs: logs, output: output};
          deferred.resolve(result)
        } else {
          deferred.resolve(result)
        }
      },
      callback: function(output) {
        deferred.resolve(output)
      },
      resolve: function(output) {
        deferred.resolve(output)
      },
    }
    Object.assign(api, this.variables);
    let code = `(function(api) {\n ${this.code} \n})()`
    vm.runInNewContext(code, api);
    return deferred.promise;
  }
}

module.exports = CodeRunner
