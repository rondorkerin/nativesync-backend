var SwaggerParser = require('swagger-parser');
var Action = require('../../../models/action');
var Service = require('../../../models/service');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var stringify = require('json-stringify-safe');
var await = require('asyncawait/await');
const pathCommand = require('path');

class SwaggerCompiler {
  constructor() { }

  createAll() {
    var fs = require('fs');
    var fileNames = fs.readdirSync('./action_specs/swagger');
    return Promise.each(fileNames, (fileName) => {
      let file = fs.readFileSync(`./action_specs/swagger/${fileName}`, {encoding: 'utf8'});
      return this.create(file);
    })
  }

  create(file) {
    return this.compile(file)
  }

  compile(file) {
    var parsed = JSON.parse(file);
    let logoURL;
    if (typeof parsed['info']['x-logo'] == 'string') {
      logoURL = parsed['info']['x-logo'];
    } else if (parsed['info']['x-logo'] && parsed['info']['x-logo']['url']) {
      logoURL = parsed['info']['x-logo']['url'];
    }
    var self = this;
    return SwaggerParser.parse(parsed['swagger'], {$refs: {circular: 'ignore'}}).then(function(data) {
      return SwaggerParser.dereference(data, {$refs: {circular: 'ignore'}}).then(async(function(data) {
        for (var path in data.paths) {
          var params = data.paths[path].parameters || [];
          for (var method in data.paths[path]) {
            if (method == 'parameters' || !path || !parsed['swagger']['basePath']) { continue; }
            var op = data.paths[path][method];
            var parameters = (op.parameters || []).concat(params);
          //    logo: logoURL,
        //      auth: parsed['swagger']['securityDefinitions'],
            let service_name = parsed['info']['title']
            let service = await(Service.findOrCreate({where: {name: service_name}}))
            let action = {
              schemes: parsed['swagger']['schemes'],
              host: parsed['swagger']['host'],
              path: pathCommand.join(parsed['swagger']['basePath'], path),
              type: 'swagger',
              service_id: service.id, // todo: upsert service
              service_name: service.name,
              method: method,
              function_name: `${method}_${path}`,
              version: parsed['info']['version'],
              description: parsed['info']['description'],
              input: parameters,
              output: op['responses'],
              input_content_type: 'application/json',
              output_content_type: 'application/json',
              official: false,
              creator_user_id: 1
            }
            if (service_name == 'sendgrid') {
              debugger;
            }
            try {
              let result = await(Action.upsert(action));
            } catch(e) {
              console.log(e);
            }
          }
        }
      }))
    })
  }
}

module.exports = SwaggerCompiler
