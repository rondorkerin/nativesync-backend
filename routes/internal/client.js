var Models = require('../../models')
var Client = Models.Client;
var async = require('asyncawait/async');

module.exports = (app, helpers) => {
  app.post('/clients', async((req, res) => {
    var client = req.body.client;
    return Client.create(client).then((results) => {
      return res.json({success: true});
    })
  }));
}
