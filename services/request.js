var Action = require('../models/action');
var Service = require('../models/service');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');
const CodeRunner = require('./code_runner');
const _ = require('underscore')
const url = require('url');

function RequiredParameterMissingException(message) {
   this.message = message;
   this.name = "RequiredParameterMissingException";
}

function RequiredAuthMissingException(message) {
   this.message = message;
   this.name = "RequiredAuthMissingException";
}

class Request {
  constructor(organization, action) {
    this.action = action;
    this.organizationID = organization.id;
    this.organization = organization;
  }

  send(input) {
    debugger;
    var serviceAuths = await(this.action.getServiceAuths());

    var headers = {}
    for (let header of this.action['headers']) {
      headers[header.key] = header.value;
    }
    var query = {}
    for (let pair of this.action['query']) {
      query[pair.key] = pair.value;
    }
    var bodyInput = {};
    var host = this.action['host'] ? this.action['host'] : {};
    var body = '';
    var requestObject = {}
    var path = this.action['path'];

    // authentication processing
    for (let serviceAuth of serviceAuths) {
      let organizationAuth = await(serviceAuth.getOrganizationAuths({where: {organization_id: this.organizationID}}))[0]
      if (!organizationAuth && serviceAuth['required']) {
        throw new RequiredAuthMissingException(serviceAuth['name']);
      }
      if (serviceAuth['type'] == 'basic') {
        requestObject['auth'] = organizationAuth['value'];
      } else if (serviceAuth['type'] == 'apiKey') {
        if (serviceAuth['details']['in'] == 'header') {
          headers[serviceAuth['details']['name']] = organizationAuth['value'].apiKeyValue;
        } else if (serviceAuth['details']['in'] == 'query') {
          query[serviceAuth['details']['name']] = organizationAuth['value'].apiKeyValue;
        }
      } else if (serviceAuth['type'] == 'configuration') {
        // configuration inputs are overwritable
        debugger;
        for (let key of Object.keys(serviceAuth['details'])) {
          if (!input[key]) {
            input[key] = organizationAuth['value'][key];
          }
        }
      }
    }

    // input processing
    for (let actionInput of this.action['input']) {
      var fieldName = actionInput['name'];
      let value = input[fieldName];
      if (actionInput['default'] && !value) {
        value = actionInput['default'];
      }
      if (actionInput['required'] && !value) {
        throw new RequiredParameterMissingException(fieldName);
      }
      if(actionInput['in'] == 'query') {
        query[fieldName] = value;
      } else if (actionInput['in'] == 'formData') {
        bodyInput[fieldName] = value;
      } else if (actionInput['in'] == 'body') {
        bodyInput[fieldName] = value;
      } else if (actionInput['in'] == 'path') {
        path = path.replace(`{${fieldName}}`, value)
      } else if (actionInput['in'] == 'host') {
        host = host.replace(`{${fieldName}}`, value)
      }
    }

    //

    // build the request object
    let requestBodyGenerator = CodeRunner.new(this.organization, this.action.input_body.code, {input: bodyInput});
    if (this.action.input_body.content_type == 'json') {
      headers['Content-Type'] == 'application/json';
      body = await(requestBodyGenerator.run())
      if (typeof body != 'string') {
        body = JSON.stringify(body);
      }
    } else if (this.action.input_body.content_type == 'xml') {
      headers['Content-Type'] == 'application/xml';
      body = requestBodyGenerator.run();
    } else if (this.action.input_body.content_type == 'form') {
      headers['Content-Type'] == 'application/x-www-form-urlencoded';
      body = querystring.stringify(bodyInput);
    }

    headers['Content-Length'] = body.length;
    requestObject['method'] = this.action['method'];
    requestObject['uri'] = url.format({
      protocol: this.action['schemes'],
      slashes: true,
      host: host,
      pathname: path,
      query: query,
      body: body
    })
    requestObject['resolveWithFullResponse'] = true;
    requestObject['headers'] = headers;
    let response = await(request(requestObject));

    var output = {};
    if (this.action.output_body.content_type == 'json') {
      output = JSON.parse(response.body)
    } else if (this.action.output_body.content_type == 'xml') {
      // todo: parse XML
      parser = new DOMParser();
      output = parser.parseFromString(response.body,"text/xml");
    }
    // output processing
    let outputParser = CodeRunner.new(this.organization, this.action.output_body.code, {output: output});

    var parsedOutput = outputParser.run();

    parsedOutput.statusCode = response.statusCode;
    return parsedOutput;
  }
}

module.exports = Request
