let Service = require('../models/service');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, stormpath) {
  app.get('/services', async(function(req, res) {
    let services = await(Service.findAll())
    return res.json(services);
  }));
}
