var Models = require('../../models');
let Service = Models.Service;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/services', async((req, res) => {
    let services = await(Service.findAll({order: 'name desc'}))
    return res.json(services);
  }));

 app.post('/services', helpers.checkauth('user'), function(req, res) {
    let result;
    if (req.body.id) {
      await(Service.update(req.body, {where: {id: req.body.id}}))
      result = await(Service.findById(req.body.id));
    } else {
      result = await(Service.create(req.body))
    }
    return res.json(result);
  });
}
