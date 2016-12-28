var Action = require('../models/action');
var Service = require('../models/service');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');
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
  constructor(organizationID, action) {
    this.action = action;
    this.organizationID = organizationID;
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
    var formData = {};
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
        formData[fieldName] = value;
      } else if (actionInput['in'] == 'body') {
        body = input[fieldName]
      } else if (actionInput['in'] == 'path') {
        path = path.replace(`{${fieldName}}`, value)
      } else if (actionInput['in'] == 'host') {
        host = host.replace(`{${fieldName}}`, value)
      }
    }

    // build the request object
    if (this.action['input_content_type'] == 'json') {
      headers['Content-Type'] == 'application/json';
    } else if (this.action['input_content_type'] == 'xml') {
      headers['Content-Type'] == 'application/xml';
    } else if (this.action['input_content_type'] == 'form') {
      headers['Content-Type'] == 'application/x-www-form-urlencoded';
      body = querystring.stringify(formData);
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

    // output processing
    var output = {};
    if (this.action['output_content_type'] == 'json') {
      output = JSON.parse(response.body)
    } else if (this.action['output_content_type'] == 'xml') {
      // todo: parse XML
      output = response.body;
    }
    debugger;

    return output;
  }
}

module.exports = Request
