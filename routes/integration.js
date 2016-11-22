let Integration = require('../models/integration');
const async = require('asyncawait/async')
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/integrations', (req, res) => {
    var integration = req.body.integration;
    integration.client_id = req.user.id;
    return Integration.create(integration).then((results) => {
      return res.json({success: true});
    })
  });

  app.get('/integrations', async((req, res) => {
    var client_id = 1;
    var results = await(Integration.findAll({where: {client_id: req.user.id}}))
    return res.json(results);
  }));
}
