'use strict'
let await = require('asyncawait/await');
let async = require('asyncawait/async');
var Models = require('../../models')
var Organization = Models.Organization;
var _ = require('underscore');
var User = Models.User;

module.exports = (app, helpers) => {
  app.get('/me', helpers.checkauth('user'), (req, res) => {
    return res.json(req.user);
  });

  app.post('/me/updateOrg', helpers.checkauth('user'), (req, res) => {
    var data = req.body.organization;
    var availableFields = ['contact_name', 'contact_email', 'name', 'contact_phone', 'stripeToken'];
    var updateData = {};
    _.each(availableFields, (field) => {
      if (data[field]) {
        updateData[field] = data[field];
      }
    });
    var organization = await(Models.Organization.update(updateData, {where: {id: req.user.org.id}}));

    return res.json({organization: organization});
  });

  app.post('/me/update', helpers.checkauth('user'), (req, res) => {
    var data = req.body;
    var availableFields = ['default_organization_id', 'name', 'avatar_url'];
    var updateData = {};
    _.each(availableFields, (field) => {
      if (data[field]) {
        updateData[field] = data[field];
      }
    });
    var user = await(User.update(updateData, {where: {id: req.user.id}}));

    return res.json(user);
  });

  app.get('/me/associations', helpers.checkauth('user'), (req, res) => {
    var organizations = await(req.user.getOrganizations());
    return res.json({organizations: organizations});
  });
}
