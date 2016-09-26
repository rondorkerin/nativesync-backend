var SwaggerParser = require('swagger-parser');
var Service = require('../../../models/service');
var Promise = require('bluebird');

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
    return this.compile(file).then(Service.upsert);
  }

  compile(file) {
    var parsed = JSON.parse(file);
		let logoURL; 
		if (typeof parsed['info']['x-logo'] == 'string') {
			logoURL = parsed['info']['x-logo'];	
		} else if (parsed['info']['x-logo'] && parsed['info']['x-logo']['url']) { 
			logoURL = parsed['info']['x-logo']['url'];
		}
    let service = {
      driver: 'swagger',
      spec: JSON.stringify(parsed['swagger']),
      name: parsed['info']['title'],
      logo: logoURL,
      version: parsed['info']['version'],
      description: parsed['info']['description'],
      auth: parsed['swagger']['securityDefinitions'],
      triggers: [], 
      actions: [],
    }
    var self = this;
    return SwaggerParser.parse(parsed['swagger']).then(function(data) {
      return SwaggerParser.dereference(data).then(function(data) {
        for (var path in data.paths) {
          var params = data.paths[path].parameters || [];
					for (var method in data.paths[path]) {
						if (method == 'parameters') { continue; }
						var op = data.paths[path][method];
						var parameters = (op.parameters || []).concat(params);
						// TODO: fix this case
						if (service['name'] == 'New York Times') { debugger; } 
						service['actions'].push({
							functionName: `${method}_${path}`,
							inputs: parameters,
							outputs: []
						});
					}
				}
				return service;
      })
    })
  }
}

module.exports = SwaggerCompiler
