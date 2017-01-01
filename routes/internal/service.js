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
    delete service['ServiceAuths'];
    let serviceAuths = req.body.serviceAuths;

    try {
      if (service.id) {
        await(Service.update(service, {where: {id: service.id}}))
        service = await(Service.findById(service.id));
      } else {
        service = await(Service.create(service))
      }

      console.log('setting service auths', serviceAuths);
      for (let serviceAuth of serviceAuths) {
        if (serviceAuth.id) {
          await(Models.ServiceAuth.update(serviceAuth, {where: {id: serviceAuth.id}}));
        } else {
          await(Models.ServiceAuth.create(serviceAuth));
        }
      }

      serviceAuths = await(service.getServiceAuths());
      console.log('upsert service', service, serviceAuths);
      return res.json({service: service, serviceAuths: serviceAuths});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });

  app.get('/service/:id', helpers.checkauth('user'), (req, res) => {
    var service = await(Service.findById(req.params.id, {
      include: [{model: Models.ServiceAuth, as: 'ServiceAuths'}]
    }))
    return res.json({service: service, serviceAuths: service.ServiceAuths});
  });

}
