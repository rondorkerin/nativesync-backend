'use strict'
var SwaggerParser = require('swagger-parser');
var Action = require('../../../models/action');
var URI = require('urijs')
var Service = require('../../../models/service');
var helpers = require('../../../helpers');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var stringify = require('json-stringify-safe');
var await = require('asyncawait/await');
const pathCommand = require('path');

var compile = async(function(file) {
  var parsed = JSON.parse(file);
  let logoURL;
  if (typeof parsed['info']['x-logo'] == 'string') {
    logoURL = parsed['info']['x-logo'];
  } else if (parsed['info']['x-logo'] && parsed['info']['x-logo']['url']) {
    logoURL = parsed['info']['x-logo']['url'];
  }
  var self = this;
  var api = await(SwaggerParser.parse(parsed['swagger'], {$refs: {circular: 'ignore'}}));
  var data = await(SwaggerParser.resolve(api, {}))
  let service_name = parsed['info']['title']
  var service = {
    visibility: 'public',
    name: service_name,
    logo_url: logoURL,
    organization_id: 31,
    description: parsed['info']['description']
  };
  var baseUrl = URI.build({
    protocol: parsed['swagger']['schemes'] ? parsed['swagger']['schemes'][0] : 'http',
    hostname: parsed['swagger']['host'],
    path: parsed['swagger']['basePath']
  }).toString();
  service.api_base_urls = [baseUrl]
  await(Service.upsert(service))
  service = await(Service.findOne({where: {name: service_name}}));
  debugger; // check that service object comes back
  for (var path in data.paths) {
    var params = data.paths[path].parameters || [];
    for (var method in data.paths[path]) {
      if (method == 'parameters' || !path || !parsed['swagger']['basePath']) { continue; }
      var op = data.paths[path][method];
      var parameters = (op.parameters || []).concat(params);
  //      auth: parsed['swagger']['securityDefinitions'],
      debugger; // check parameters
      let action = {
        schemes: parsed['swagger']['schemes'],
        host: baseUrl,
        path: path,
        type: 'swagger',
        service_id: service.id, // todo: upsert service
        service_name: service.name,
        method: method,
        function_name: `${method} ${path}`,
        internal_name: helpers.internalize(`${method}_${path}`),
        version: parsed['info']['version'],
        description: parsed['info']['description'],
        input: parameters,
        output: op['responses'],
        input_content_type: 'application/json',
        output_content_type: 'application/json',
        official: false,
        creator_user_id: 1
      }
      try {
        let result = await(Action.upsert(action));
      } catch(e) {
        console.log(e);
      }
    }
  }
})

class SwaggerCompiler {
  constructor() { }

  createAll() {
    var fs = require('fs');
    var fileNames = fs.readdirSync('./action_specs/swagger');
    return Promise.each(fileNames, (fileName) => {
      let file = fs.readFileSync(`./action_specs/swagger/${fileName}`, {encoding: 'utf8'});
      return compile(file);
    })
  }

}

module.exports = SwaggerCompiler
