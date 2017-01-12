'use strict'
var express = require('express');
var fs = require('fs');
var Models = require('../../models');
var _ = require('underscore');
var OAuth2 = require('simple-oauth2');
var Guid = require('guid');
var await = require('asyncawait/await');
var async = require('asyncawait/async');

module.exports = function(app, helpers) {
  var createOauth = async((serviceAuth, organizationId) => {
    var configuration = await(Models.OrganizationAuth.getConfigurations(serviceAuth.service_id, organizationId));
    var details = serviceAuth.details;
    var credentials = {
      client: {
        id: details.clientId,
        secret: details.clientSecret,
      },
      auth: {
        tokenHost: helpers.mergeVariables(details.tokenHost, configuration),
      }
    };
    if (details.secretParamName) { credentials.client.secretParamName = details.secretParamName }
    if (details.idParamName) { credentials.client.idParamName = details.idParamName }
    if (details.tokenPath) { credentials.auth.tokenPath = helpers.mergeVariables(details.tokenPath, configuration); }
    if (details.revokePath) { credentials.auth.revokePath = helpers.mergeVariables(details.revokePath, configuration); }
    if (details.authorizehost) { credentials.auth.authorizehost = helpers.mergeVariables(details.authorizehost, configuration); }
    if (details.authorizePath) { credentials.auth.authorizePath = helpers.mergeVariables(details.authorizePath, configuration); }
    console.log('creating oauth', credentials);
    return OAuth2.create(credentials);
  })

  app.get('/oauth/2.0/callback', async((req, res, next) => {
    var resultObject = Object.assign(req.body, req.query);
    console.log('callback hit', resultObject);
  }))

  app.get('/oauth/2.0/authenticate/:service_auth_id/org/:organization_id', async((req, res, next) => {
    var serviceAuth = await(Models.ServiceAuth.findById(req.params.service_auth_id))
    var callbackUrl = `https://api.nativesync.io/oauth/2.0/callback`;
    var oauth2 = await(createOauth(serviceAuth, req.params.organization_id));
    var state = Guid.raw();
    var orgAuth = {
      service_id: serviceAuth.service_id,
      service_auth_id: serviceAuth.id,
      organization_id: req.params.organization_id,
      value: {
        state: state
      }
    }
    orgAuth = await(Models.OrganizationAuth.upsert(orgAuth))
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: callbackUrl,
      scope: serviceAuth.details.scopes,
      state: JSON.stringify({state: state, organization_auth_id: orgAuth.id}),
    });
    return res.redirect(authorizationUri);
  }));

};
