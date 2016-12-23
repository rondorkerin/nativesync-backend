var Models = require('../../models');
let Service = Models.Service;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/services', async((req, res) => {
    let services = await(Service.findAll({order: 'name desc'}))
    return res.json({services: services});
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

 app.post('/services/upsert', helpers.checkauth('user'), function(req, res) {
    let result;
    let service = req.body.service;
    let serviceAuths = req.body.serviceAuths;

    // associate the service with a service
    service.service_id = service.id;
    try {
      if (service.id) {
        await(Service.update(service, {where: {id: service.id}}))
        service = await(Service.findById(service.id));
      } else {
        service = await(Service.create(service))
      }

      await(service.setServiceAuths(serviceAuths));

      var serviceAuths = await(service.getServiceAuths());
      return res.json({service: service, serviceAuths: serviceAuths});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });

  app.get('/service/:id', helpers.checkauth('user'), (req, res) => {
    var service = await(IntegrationInstance.findById(req.params.id, {
      include: [{model: Models.ServiceAuth, as: 'ServiceAuths'}]
    }))
    return res.json({service: service, serviceAuths: service.ServiceAuths});
  });

}
