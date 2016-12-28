var Models = require('../../models')
var OrganizationAuth = Models.OrganizationAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/organization_auths', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the organization_id in the filter)
    var serviceAuthIds = req.query.service_auth_ids;
    var organizationId = req.query.organization_id;
    try {
      var organizationAuths = await(Models.OrganizationAuth.findAll({where: {
        organization_id: organizationId,
        service_auth_id: {
          $in: serviceAuthIds
        }
      }}));
      return res.json({organizationAuths: organizationAuths});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });

  app.post('/auth_credentials', helpers.checkauth(), (req, res) => {
    var credentials = req.body.credentials;
    credentials.organization_id = req.user.id;
    return OrganizationAuth.create(credentials).then((results) => {
      return res.json({success: true});
    })
  });

  app.get('/auth_credentials', helpers.checkauth(), (req, res) => {
    return OrganizationAuth.findAll({where: {organization_id: req.user.id}}).then((results) => {
      return res.json(results);
    })
  });

  app.get('/auth_credentials/:service', helpers.checkauth(), (req, res) => {
    return OrganizationAuth._getAllForService(req.user.id, req.params['service']).then((results) => {
      return res.json(results);
    })
  });
}
