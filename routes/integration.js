let Integration = require('../models/integration');

module.exports = (app, helpers) => {
  app.post('/integrations', helpers.checkauth(), (req, res) => {
    var integration = req.body.integration;
    integration.client_id = req.user.id;
    return Integration.create(integration).then((results) => {
      return res.json({success: true});
    })
  });

  app.get('/integrations', helpers.checkauth(), (req, res) => {
    return Integration.findAll({where: {client_id: req.user.id}})
    .then(function(results) {
      return res.json(results);
    })
  });
}
