const Models = require('../../models');
const Services = require('../../services');
const IntegrationInstance = Models.IntegrationInstance;
const Integration = Models.Integration;
const IntegrationRunner = require('../../services/integration_runner');
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/integration_instance/:id/run', async((req, res) => {
    console.log('params', req.params);
    let integrationInstance = await(IntegrationInstance.findById(req.params.id));
    let integration = await(integrationInstance.getIntegration());
    let integrationCode = await(integration.getIntegrationCode());
    let client = await(integrationInstance.getClient());
    let output = await(new IntegrationRunner(client, integration, integrationInstance, integrationCode).run());
    return res.json(output);
  }));

  app.post('/integrations', async((req, res) => {
    var integration = req.body.integration;
    integration.partner_id = req.session.partner_id;
    return Integration.create(integration).then((results) => {
      return res.json({success: true});
    })
  }));

  app.get('/integrations', async((req, res) => {
    var results = await(Integration.findAll())
    return res.json(results);
  }));

  app.get('/me/integrations', async((req, res) => {
    var results = await(Integration.findAll({where: {partner_id: req.session.partner_id}}))
    return res.json(results);
  }));

  app.get('/me/integration_instances', async((req, res) => {
    var results = await(IntegrationInstance.findAll({where: {client_id: req.session.client_id}}))
    return res.json(results);
  }));
}
