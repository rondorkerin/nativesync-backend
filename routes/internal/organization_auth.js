'use strict'
var Models = require('../../models')
var OrganizationAuth = Models.OrganizationAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
 app.post('/organization_auths/upsert', helpers.checkauth('user'), function(req, res) {
    let organizationAuth = req.body.organizationAuth;
    console.log('upserting org auth', organizationAuth);

    if (organizationAuth.organization_id && organizationAuth.organization_id != req.user.org.id) {
      return res.status(401).send('Invalid permissions to edit this action')
    }

    try {
      if (organizationAuth.id) {
        await(OrganizationAuth.update(organizationAuth, {where: {id: organizationAuth.id}}))
        organizationAuth = await(OrganizationAuth.findById(organizationAuth.id));
      } else {
        organizationAuth = await(OrganizationAuth.create(organizationAuth))
      }

      return res.json({organizationAuth: organizationAuth});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  })

  app.get('/organization_auths', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the organization_id in the filter)
    var serviceAuthIds = req.query.service_auth_ids;
    var organizationId = req.query.organization_id;
    if (!(serviceAuthIds && organizationId)) {
      return res.json({organizationAuths: []});
    }
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
