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

var translateSchemaToParams = function(schema) {
  var params = [];
  if (!schema) {
    return [];
  }
  if (schema.type == 'object') {
    var properties = schema.properties ? schema.properties : {};
    var additionalProperties = schema.additionalProperties ? schema.additionalProperties : {};
    if (additionalProperties && additionalProperties.properties) {
      properties = Object.assign(properties, additionalProperties);
    }
    for (var name in properties) {
      var property = properties[name];
      var param = {name: name, description: property.description, type: property.type}
      if (property.type == 'array') {
        param.params = translateSchemaToParams(property.items);
      } else if (property.type == 'object') {
        param.params = translateSchemaToParams(property.schema);
      }
      params.push(param);
    }
  } else if (schema.type == 'file') {
    // no-op.
  } else if (schema.allOf) {
    var translated = _.map(schema.allOf, translateSchemaToParams);
    return _.reduce(translated, function(all, current) { return all.concat(current); }, []);
  } else if (schema.type == 'array') {
    return [{type: 'array', params: translateSchemaToParams(schema.items)}];
  } else if (schema.type) {
    return [{type: schema.type, name: 'result'}]
  } else {

  }
  return params;
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
    var definition = buildSecurityDefinition(service, name, api.securityDefinitions[name]);
    await(Models.ServiceAuth.upsert(definition))
  }
  for (var name in api.definitions) {
    var definition = buildServiceDefinition(service, name, api.definitions[name]);
    await(Models.ServiceDefinition.upsert(definition))
  }
  for (var path in api.paths) {
    var params = api.paths[path].parameters || [];
    for (var method in api.paths[path]) {
      if (method == 'parameters' || !path || !parsed['swagger']['basePath']) { continue; }
      var op = api.paths[path][method];
      var parameters = (op.parameters || []).concat(params);
      var body = _.findWhere(parameters, {in: 'body'});
      // grab all params out of the body object.
      // If the body is a list, craete a code snippet that pulls the
      // body param into a list. If its an object, pull it out into params.
      // question: can we do this automatically on the backend, by checking if body type = list?
      // think the answer is yes.
      if (body && body['type'] == 'array')  {
        debugger;
      }
      var output = [];
      if (op['responses']['200'] && op['responses']['200']['schema']) {
        var opSchema = op['responses']['200']['schema'];
        output = translateSchemaToParams(opSchema);
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
