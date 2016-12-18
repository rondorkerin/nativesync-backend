var Models = require('../../models');
let Service = Models.Service;
let ServiceAuth = Models.ServiceAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/service_auths', helpers.checkauth(), (req, res) => {
    let service_auths = await(ServiceAuth.findAll({where: {service_id: req.query.service_id}}))
    return res.json(service_auths);
  });

 app.post('/service_auths', helpers.checkauth('user'), function(req, res) {
    let result;
    if (req.body.id) {
      await(ServiceAuth.update(req.body, {where: {id: req.body.id}}))
      result = await(ServiceAuth.findById(req.body.id));
    } else {
      result = await(ServiceAuth.create(req.body))
    }
    return res.json(result);
  });
}
