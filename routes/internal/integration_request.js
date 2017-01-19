'use strict'
const Models = require('../../models');
const Services = require('../../services');
const IntegrationRequest = Models.IntegrationRequest
const _ = require('underscore');
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, helpers) => {

  app.post('/integration_requests', helpers.checkauth('user'), (req, res) => {
    var integrationRequest = req.body.integrationRequest;
    integrationRequest.jobStatus = 'unassigned';
    integrationRequest.organization_id = req.user.org.id;
    try {
      // verify discount code.
      integrationRequest = await(IntegrationRequest.getPricing(integrationRequest));
      var integrationRequest = await(IntegrationRequest.create(integrationRequest))
      return res.json({integrationRequest: integrationRequest});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });
}
