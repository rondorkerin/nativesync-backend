'use strict'
let await = require('asyncawait/await');
let async = require('asyncawait/async');
var Models = require('../../models')
var Organization = Models.Organization;
var _ = require('underscore');
var User = Models.User;
var stripe = require("stripe")("sk_test_JTHSgN80D8A2hycJ6w6Ooooe");

//  live secret key sk_live_UL8bUbWL6qobJ0845kkWZb7q
// live publishable key pk_live_KBRCFqtxkoGuEzgNP1pDHHQi

module.exports = (app, helpers) => {
  app.get('/me', helpers.checkauth('user'), (req, res) => {
    return res.json(req.user);
  });

  app.post('/me/updateOrg', helpers.checkauth('user'), (req, res) => {
    var data = req.body.organization;
    var availableFields = ['contact_name', 'contact_email', 'name', 'contact_phone'];
    var updateData = {};
    _.each(availableFields, (field) => {
      if (data[field]) {
        updateData[field] = data[field];
      }
    });

    // save stripe info to the org object
    var organization = Object.assign(req.user.org, updateData);
    if (data.stripeToken) {
      if (!organization.stripe_customer_id) {
        console.log('making stripe customer', data.stripeToken);
        var customer = await(stripe.customers.create({
          email: organization.contact_email,
          source: data.stripeToken
        }));
        console.log('stripe customer', customer);
        updateData.stripe_customer_id = customer.id;
      }
    }
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
