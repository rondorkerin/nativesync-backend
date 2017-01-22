'use strict'
const Models = require('../../models');
const Services = require('../../services');
const IntegrationRequest = Models.IntegrationRequest
const _ = require('underscore');
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, helpers) => {

  app.get('/integration_request/:id', helpers.checkauth('user'), (req, res) => {
    var integrationRequest = req.body.integrationRequest;
    try {
      integrationRequest = await(IntegrationRequest.findById(req.params.id));
      return res.json({integrationRequest: integrationRequest});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }

  })

  app.post('/integration_request/:id', helpers.checkauth('user'), (req, res) => {
    var data = req.body;
    try {
      var integrationRequest = await(IntegrationRequest.update(data, {where: {id: req.params.id}}));
      return res.json({integrationRequest: integrationRequest});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }

  })

  app.post('/integration_requests', async((req, res) => {
    var integrationRequest = req.body.integrationRequest;
    integrationRequest.jobStatus = 'unassigned';
    try {
      // verify discount code.
      integrationRequest = await(IntegrationRequest.getPricing(integrationRequest));
      var integrationRequest = await(IntegrationRequest.create(integrationRequest))
      return res.json({integrationRequest: integrationRequest});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  }));
}
