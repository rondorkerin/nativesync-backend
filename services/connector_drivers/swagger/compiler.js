'use strict'
var SwaggerParser = require('swagger-parser');
var Action = require('../../../models/action');
var URI = require('urijs')
var _ = require('underscore');
var Service = require('../../../models/service');
var Models = require('../../../models');
var helpers = require('../../../helpers')();
var Promise = require('bluebird');
var async = require('asyncawait/async');
var stringify = require('json-stringify-safe');
var await = require('asyncawait/await');
const pathCommand = require('path');

var buildSecurityDefinition = function(service, name, securityDefinition) {
  var serviceAuthObject = {
    service_id: service.id,
    name: name
  }
  if (securityDefinition.type == 'apiKey') {
    serviceAuthObject.type = 'apiKey';
    serviceAuthObject.details = {
      in: securityDefinition.in,
      name: securityDefinition.name
    };
  } else if (securityDefinition.type == 'oauth2') {
    serviceAuthObject.type = 'oauth2';
    if (securityDefinition.scopes) {
      serviceAuthObject.details = {
        authUrl: securityDefinition.authorizationUrl,
        scopes: Object.keys(securityDefinition.scopes).join(', ')
      }
    } else {
      serviceAuthObject.details = {};
    }
  } else if (securityDefinition.type == 'basic') {
    serviceAuthObject.type = 'basic';
    serviceAuthObject.details = {"usernameFieldLabel":"Username","passwordFieldLabel":"Password"}
  } else {
    debugger;
  }

  return serviceAuthObject;
}

var buildServiceDefinition = function(service, name, definition) {
  return {
    service_id: service.id,
    name: name,
    definition: definition
  }
}


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
  api = await(SwaggerParser.dereference(api, {$refs: {circular: 'ignore'}}))
  let service_name = parsed['info']['title']
  console.log('working service', service_name);
  var service = {
    visibility: 'published',
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
  for (var name in api.securityDefinitions) {
    console.log('creating security def', name, 'for service', service.name);
    var definition = buildSecurityDefinition(service, name, api.securityDefinitions[name]);
    await(Models.ServiceAuth.upsert(definition))
  }
  for (var name in api.definitions) {
    console.log('creating definition', name, 'for service', service.name);
    // var definition = buildServiceDefinition(service, name, api.definitions[name]);
    // await(Models.ServiceDefinition.upsert(definition))
  }

  var serviceAuthsByName = _.indexBy(await(Models.ServiceAuth.findOne({where: {service_id: service.id}})), 'name');
  for (var path in api.paths) {
    var params = api.paths[path].parameters || [];
    for (var method in api.paths[path]) {
      if (method == 'parameters' || !path || !parsed['swagger']['basePath']) { continue; }
      var op = api.paths[path][method];
      var parameters = (op.parameters || []).concat(params);
      var output = [];
      if (op['responses']['200'] && op['responses']['200']['schema']) {
        var output = op['responses']['200']['schema'];
      } else if (op['responses']['200'] && op['responses']['200']['type']) {
        debugger;
      }

      let action = {
        schemes: parsed['swagger']['schemes'],
        host: baseUrl,
        path: path,
        type: 'swagger',
        service_id: service.id,
        service_name: service.name,
        method: method.toUpperCase(),
        visibility: 'published',
        input_body: {"content_type":"json","body_code_type":"direct"},
        output_body: {"content_type":"json","body_code_type":"direct"},
        title: `${method} ${path}`,
        function_name: `${method} ${path}`,
        organization_name: "NativeSync",
        organization_id: 31,
        version: parsed['info']['version'],
        description: parsed['info']['description'],
        input: parameters,
        output: output,
        input_content_type: 'application/json',
        output_content_type: 'application/json',
        official: false,
        creator_user_id: 1
      }
      action.internal_name = Action.getInternalName(action);
      console.log('creating action', service_name, action.internal_name);
      try {
        let result = await(Action.upsert(action));
      } catch(e) {
        console.log(e);
      }
      if (api.paths[path][method].security && api.paths[path][method].security.length > 1) {
        action = Action.findOne({where: {internal_name: action.internal_name}});
        _.each(api.paths[path][method].security, (securityObject) => {
          var name = Object.keys(securityObject);
          var serviceAuth = serviceAuthsByName[name];
          if (serviceAuth) {
            var actionServiceAuth = {service_auth_id: serviceAuth.id, action_id: action.id}
            await(Models.ActionServiceAuth.upsert(actionServiceAuth))
          }
        });
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
