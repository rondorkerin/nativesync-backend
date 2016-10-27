let Integration = require('../models/integration');

module.exports = (app, passport, helpers) => {
  app.post('/integration', helpers.checkauth(passport), (req, res) => {
    var integration = req.body.integration;
    integration.client_id = req.user.id;
    return Integration.create(integration).then((results) => {
      return res.json({success: true});
    })
  });

  app.get('/integrations', helpers.checkauth(passport), (req, res) => {
    return Integration.findAll({where: {client_id: req.user.id}})
    .then(function(results) {
      return res.json(results);
    })
  });
}
