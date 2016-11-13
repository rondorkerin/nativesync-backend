var SwaggerParser = require('swagger-parser');
var Connector = require('../../../models/connector');
var Service = require('../../../models/service');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

class SwaggerCompiler { 
  constructor() { }

  createAll() {
		var fs = require('fs');
		var fileNames = fs.readdirSync('./api_specs/swagger');
		return Promise.each(fileNames, (fileName) => {
			let file = fs.readFileSync(`./api_specs/swagger/${fileName}`, {encoding: 'utf8'});
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
    return SwaggerParser.parse(parsed['swagger']).then(function(data) {
      return SwaggerParser.dereference(data).then(async(function(data) {
        for (var path in data.paths) {
          var params = data.paths[path].parameters || [];
					for (var method in data.paths[path]) {
						if (method == 'parameters') { continue; }
						var op = data.paths[path][method];
						var parameters = (op.parameters || []).concat(params);
					//		logo: logoURL,
				//			auth: parsed['swagger']['securityDefinitions'],
						let service_name = parsed['info']['title']
						let service = await(Service.findOrCreate({where: {name: service_name}}))
						let connector = {
							type: 'swagger',
							service_id: service.id, // todo: upsert service
							service_name: service.name,
							function_name: `${method}_${path}`,
							version: parsed['info']['version'],
							description: parsed['info']['description'],
							input: parameters,
							output: {},
							configuration: {},
							official: false,
							creator_user_id: 1
						}
						try { 
							let result = await(Connector.upsert(connector));
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
