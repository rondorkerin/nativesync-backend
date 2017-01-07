var Models = require('../../models');
let Service = Models.Service;
let ServiceDefinition = Models.ServiceDefinition;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/service_definitions', helpers.checkauth(), (req, res) => {
    let service_definitions = await(ServiceDefinition.findAll({where: {service_id: req.query.service_id}}))
    return res.json({serviceDefinitions: service_definitions});
  });
}
