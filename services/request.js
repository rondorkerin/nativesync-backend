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
  constructor(clientID, action) {
    this.action = action;
    this.clientID = clientID;
    this.serviceAuths = this.action.getServiceAuths();
    this.clientAuths = this.serviceAuths.getClientAuths({where: {client_id: clientID}})
  }

  send(input) {
    var headers = this.action['headers'] ? this.action['headers'] : {}
    var formData = {};
    var query = this.action['query'] ? this.action['query'] : {};
    var body = '';
    var requestObject = {}
    var path = this.action['path'];
    for (let serviceAuth of this.serviceAuths) {
      let clientAuth = this.clientAuths.find((clientAuth) => {
        clientAuth.service_auth_id == servieAuth.id;
      })
      if (!clientAuth) {
        throw new RequiredParameterMissingException(serviceAuth['name']));
      }
      if (serviceAuth['type'] == 'apiKey') {
        if (serviceAuth['details']['in'] == 'header') {
          headers[serviceAuth['details']['name']] = clientAuth['value'];
        } else if (serviceAuth['details']['in'] == 'query') {
          query[serviceAuth['details']['name']] = clientAuth['value'];
        }
      }
    }
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
      }
    }
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
      protocol: this.action['schemes'][0],
      slashes: true,
      host: this.action['host'],
      pathname: path,
      query: query,
      body: body
    })
    requestObject['resolveWithFullResponse'] = true;
    requestObject['headers'] = headers;
    debugger;
    let response = await(request(requestObject));

    var output = {};
    if (this.action['output_content_type'] == 'json') {
      output = JSON.parse(response.body)
    } else if (this.action['output_content_type'] == 'xml') {
      // todo: parse XML
      output = response.body;
    }

    return output;
  }
}

module.exports = Request
