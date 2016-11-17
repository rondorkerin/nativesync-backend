var SwaggerParser = require('swagger-parser');
var Connector = require('../../../models/connector');
var Service = require('../../../models/service');
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

class Request {
  constructor(connector) { this.action = action; }

  send(input) {
    var headers = this.action['headers'] ?: {};
    var formData = {};
    var query = this.action['query'] ?: {};
    var body = '';
    var requestObject = {}
    var path = this.action['path'];
    for (let actionInput of this.action['inputs']) {
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
      }
    }
    if (this.action['input_content_type'] == 'json') {
      headers['Content Type'] == 'application/json';
    } else if (this.action['input_content_type'] == 'xml') {
      headers['Content Type'] == 'application/xml';
    } else if (this.action['input_content_type'] == 'form') {
      headers['Content-Type'] == 'application/x-www-form-urlencoded';
      body = querystring.stringify(formData);
    }
    headers['Content-Length'] = body.length();
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
    let response = await(request(requestObject));

    return response;
  }
}

module.exports = SwaggerCompiler
