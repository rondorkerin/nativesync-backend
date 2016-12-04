const Models = require('../models');
const IntegrationInstance = Models['IntegrationInstance'];
const Integration = Models['Integration'];
const IntegrationRunner = require('../services/integration_runner');
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, stormpath) => {
  app.post('/integration_instance/:id/run', async((req, res) => {
    console.log('params', req.params);
    let integrationInstance = await(IntegrationInstance.findById(req.params.id));
    let integration = await(integrationInstance.getIntegration());
    let integrationCode = await(integration.getIntegrationCode());
    let client = await(integrationInstance.getClient());
    let output = await(new IntegrationRunner(client, integration, integrationInstance, integrationCode).run());
    return res.json(output);
  }));

  app.post('/integrations', (req, res) => {
    var integration = req.body.integration;
    integration.client_id = req.user.id;
    return Integration.create(integration).then((results) => {
      return res.json({success: true});
    })
  });

  app.get('/integrations', (req, res) => {
    var results = await(Integration.findAll())
    return res.json(results);
  });

  app.get('/me/integrations', (req, res) => {
    var client_id = 1;
    var results = await(Integration.findAll({where: {client_id: req.user.id}}))
    return res.json(results);
  });
}
