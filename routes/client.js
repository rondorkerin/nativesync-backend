let Client = require('../models/client');

module.exports = (app, passport, helpers) => {
  app.post('/clients', (req, res) => {
    var client = req.body.client;
    return Client.create(client).then((results) => {
      return res.json({success: true});
    })
  });
}
