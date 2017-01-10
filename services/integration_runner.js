'use strict'
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Models = require('../models');
const vm = require('vm');
const request = require('request-promise');
const CodeRunner = require('./code_runner');

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
    var codeRunner = new CodeRunner(this.organization, this.integrationCode.code, {input: this.integrationInstance.inputs});
    return codeRunner.run();
  }
}

module.exports = IntegrationRunner
