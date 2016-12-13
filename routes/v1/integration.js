const Models = require('../../models');
const Services = require('../../services');
const IntegrationInstance = Models.IntegrationInstance;
const Integration = Models.Integration;
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/integration_instance/:id/run', helpers.checkauth('client'), (req, res) => {
    console.log('params', req.params);
    let integrationInstance = await(IntegrationInstance.findById(req.params.id));
    let integration = await(integrationInstance.getIntegration());
    let integrationCode = await(integration.getIntegrationCode());
    let client = await(integrationInstance.getClient());
    let output = await(new Services.IntegrationRunner(client, integration, integrationInstance, integrationCode).run());
    return res.json(output);
  });
}
