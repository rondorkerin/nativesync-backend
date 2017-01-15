'use strict'
var Promise = require('bluebird');
var _ = require('underscore');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Models = require('../models');
const vm = require('vm');
const request = require('request-promise');
var queryString = require('query-string');

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
    var errors = [];
    var api = {
      '_': _,
      Promise: Promise,
      request: request,
      setOrganizationAuth(serviceName, serviceAuthName, value) {
        return request.post({
          url: encodeURI(nsUrl + "/organization_auths"),
          json: true,
          body: {name: name, value: value},
          headers: {
            'X-Api-Key': organizationApiKey
          }
        });

      },
      callAction: function(actionDescription, input) {
        var actionObject = {};
        if (typeof actionDescription == 'string') {
          var params = actionDescription.split("/");
          if (!isNaN(actionDescription)) {
            actionObject.id = parseInt(actionDescription);
          } else if (params.length > 0) {
            actionObject.org_name = matchParams[0];
            actionObject.service_name = matchParams[1];
            actionObject.function_name = matchParams[2];
            if (params[3])  {
              actionObject.version = matchParams[3];
            }
          } else {
            errors.push(`action description invalid: ${actionDescription}`);
          }
        }
        return request.post({
          url: encodeURI(nsUrl + "/action/invoke" + queryString.stringify(actionObject)),
          json: true,
          body: input,
          headers: {
            'X-Api-Key': organizationApiKey
          }
        });
      },
      setData: function(key, value) {
        return Models['OrganizationDatastore'].upsert({organization_id: organizationID, key: key, value: value})
      },
      pushData: function(key, value) {
        return Models['OrganizationDatastore'].findAll({where: {organization_id: organizationID, key: key}}).then((result) => {
          result.value = result.value.push(value);
          return result.save();
        })
      },
      getData: function(key) {
        return Models['OrganizationDatastore'].findAll({where: {organization_id: organizationID, key: key}})
      },
      log: function(message) {
        if (options.loggingEnabled) {
          if (typeof message == 'object') {
            logs.push(JSON.stringify(message));
          } else {
            logs.push(message.toString());
          }
        }
      },
      end: function(output) {
        var result = {logs: logs, output: output, errors: errors};
        deferred.resolve(result)
      },
      output: function(output) {
        var result = {logs: logs, output: output, errors: errors};
        deferred.resolve(result)
      },
      callback: function(output) {
        var result = {logs: logs, output: output, errors: errors};
        deferred.resolve(result)
      },
      resolve: function(output) {
        var result = {logs: logs, output: output, errors: errors};
        deferred.resolve(result)
      },
    }
    // hook the API in
    Object.assign(api, this.variables);

    var resolve = '';
    if (this.code.indexOf('resolve') === -1
        && this.code.indexOf('callback') === -1
        && this.code.indexOf('end') === -1) {
      resolve = 'end();' ;
    }
    let code = `(function(api) {\n ${this.code} \n ${resolve} \n})()`
    vm.runInNewContext(code, api);
    return deferred.promise;
  }
}

module.exports = CodeRunner
