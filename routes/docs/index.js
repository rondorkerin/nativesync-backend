'use strict'
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var express = require('express');
var fs = require('fs');
var Models = require('../../models');
var _ = require('underscore');

module.exports = function(app, helpers) {
  var docsRouter = express.Router();
  app.use('/docs', docsRouter);

  // allow CORS
  docsRouter.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  docsRouter.get('/swagger.json', async ((req, res, next) => {
    var swaggerJson = fs.readFileSync('./docs/external_api.json', {encoding: 'utf8'});
    return res.send(swaggerJson);
  }));

  docsRouter.get('/service/:service_id/swagger.json', async ((req, res, next) => {
    var service_id = req.params.service_id;
    var service = await(Models.Service.findById(service_id, {include: [Models.Action]}));
    var actions = service.actions;
    var swaggerJsonTemplate = JSON.parse(fs.readFileSync('./docs/action_api_template.json', {encoding: 'utf8'}));
    swaggerJsonTemplate['info']['title'] = `NativeSync REST API for ${service.name}`;
    var actionTemplate = swaggerJsonTemplate['paths']['/action/identifier/invoke'];
    var paths = {};
    _.each(actions, (action) => {
      var customAction = Object.assign({}, actionTemplate);
      console.log('custom action', actionTemplate);

      var inputs = {};
      _.each(action.input, (param) => {
        inputs[param.name] = { type: param.type ? param.type : 'string'}
        if (param.description) {
          inputs[param.name].description = param.description;
        }
      })
      customAction['post']['parameters'][0].schema.properties.input.properties = inputs;

      var outputs = {};
      _.each(action.output, (param) => {
        outputs[param.name] = { type: param.type ? param.type : 'string' }
        if (param.description) {
          outputs[param.name].description = param.description;
        }
      })
      customAction['post']['responses']['200'].schema.properties.output.properties = outputs;
      customAction['post']['summary'] = `${action.function_name} - maintained by ${action.organization_name}`;
      customAction['post']['description'] = action.description;

      paths[`/action/${action.internal_name}/invoke`] = customAction;
    })
    var actionSwagger = Object.assign({}, swaggerJsonTemplate);
    actionSwagger.paths = paths;
    return res.send(actionSwagger);
  }));
};
