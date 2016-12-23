const Models = require('../../models');
const Services = require('../../services');
const IntegrationInstance = Models.IntegrationInstance;
const Integration = Models.Integration;
const IntegrationCode = Models.IntegrationCode;
const _ = require('underscore');
const IntegrationRunner = require('../../services/integration_runner');
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/integration_instance/:id/run', helpers.checkauth('user'), (req, res) => {
    console.log('params', req.params);
    let integrationInstance = await(IntegrationInstance.findById(req.params.id));
    let integration = await(integrationInstance.getIntegration());
    let integrationCode = await(integration.getIntegrationCode());
    let client = await(integrationInstance.getClient());
    let output = await(new IntegrationRunner(client, integration, integrationInstance, integrationCode).run());
    return res.json(output);
  });

  app.post('/integrations', helpers.checkauth('user'), (req, res) => {
    var integration = req.body.integration;
    integration.partner_id = req.session.partner_id;
    return Integration.create(integration).then((results) => {
      return res.json({success: true});
    })
  });

  app.post('/integrations/upsert', helpers.checkauth('user'), function(req, res) {
    let result;
    let integration = req.body.integration;
    let integrationCode = req.body.integrationCode;
    let services = req.body.services;
    var serviceIDs = _.pluck(services, 'id');
    let actions = req.body.actions;
    var actionIDs = _.pluck(actions, 'id');

    try {
      if (integration.id) {
        await(Integration.update(integration, {where: {id: integration.id}}))
        integration = await(Integration.findById(integration.id));
      } else {
        integration = await(Integration.create(integration))
      }

      integrationCode.integration_id = integration.id;
      IntegrationCode.upsert(integrationCode);

      await(integration.setServices(serviceIDs));
      await(integration.setActions(actionIDs));

      return res.json({integration: integration});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });

  app.get('/integrations', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the partner_id in the filter)
    var filter = req.body;
    console.log('filter', filter);
    var integrations = await(Integration.findAll({where: filter}))
    return res.json({integrations: integrations});
  });

  app.get('/integration/:id', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the partner_id in the filter)
    var integration = await(Integration.findById(
          req.params.id,
          {include: ['Actions', 'Services']}
    ));
    if (integration) {
      var result = {
        integration: integration,
        services: integration.Services,
        actions: integration.Actions
      }
      var serviceAuths = await(actions.getServiceAuths());
      result.serviceAuths = serviceAuths;
      if (req.query.includeAssociations) {
        let integrationCode = await(Models.IntegrationCode.findOne({where: {integration_id: integration.id}}))
        result.integrationCode = integrationCode;
      }
      return res.json(result);
    } else {
      return res.status(400).send('no such integration');
    }
  });

  app.get('/integration_instance/:id', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the partner_id in the filter)
    console.log('looking up integration instance id', req.params.id);
    var integrationInstance = await(IntegrationInstance.findById(req.params.id))
    if (integrationInstance) {
      var client = await(Models.Client.findById(integrationInstance.client_id));
      let integration = await(Integration.findById(
          integrationInstance.integration_id,
          {include: ['Actions', 'Services']}
      ));
      var serviceAuths = await(actions.getServiceAuths());
      return res.json({
        integration: integration,
        integrationInstance: integrationInstance,
        client: client,
        actions: integration.actions,
        services: integration.services,
        serviceAuths: serviceAuths
      });
    } else {
      return res.status(400).send('no such integration instance');
    }
  });

  app.get('/integration/:id/instances', helpers.checkauth('user'), (req, res) => {
    console.log('get instances for', req.params.id);
    var instances = await(IntegrationInstance.findAll({
      where: {integration_id: req.params.id},
      include: [Models.Client]
    }))
    return res.json({integrationInstances: instances});
  });

  app.get('/me/integration_instances', helpers.checkauth('user'), (req, res) => {
    var results = await(IntegrationInstance.findAll({where: {client_id: req.session.client_id}}))
    return res.json(results);
  });

  app.post('/integration_instances/upsert', helpers.checkauth('user'), function(req, res) {
    let result;
    let integrationInstance = req.body.integrationInstance;
    let integration = req.body.integration;
    let client = req.body.client;

    integrationInstance.integration_id = integration.id;
    integrationInstance.client_id = client.id;
    console.log('upserting instance', integrationInstance);
    try {
      if (integrationInstance.id) {
        await(IntegrationInstance.update(integrationInstance, {where: {id: integrationInstance.id}}))
        integrationInstance = await(IntegrationInstance.findById(integrationInstance.id));
      } else {
        integrationInstance = await(IntegrationInstance.create(integrationInstance))
      }
      return res.json({integrationInstance: integrationInstance, client: client});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });
}
