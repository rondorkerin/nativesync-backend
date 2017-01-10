'use strict'
const Models = require('../../models');
const Services = require('../../services');
const IntegrationInstance = Models.IntegrationInstance;
const Integration = Models.Integration;
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/integration_instance/:id/invoke', helpers.checkauth('organization'), (req, res) => {
    console.log('params', req.params);
    let integrationInstance = await(IntegrationInstance.findById(req.params.id));
    let integration = await(integrationInstance.getIntegration());
    let integrationCode = await(integration.getIntegrationCode());
    let organization = await(integrationInstance.getOrganization());
    let output = await(new Services.IntegrationRunner(organization, integration, integrationInstance, integrationCode).run());
    return res.json(output);
  });
}
