var Models = require('../../models');
let Service = Models.Service;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/services', async((req, res) => {
    let services = await(Service.findAll())
    return res.json(services);
  }));
}
