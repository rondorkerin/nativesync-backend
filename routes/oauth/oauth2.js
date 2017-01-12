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
        secretParamName: details.secretParamName,
        idParamName: details.idParamName,
      },
      auth: {
        tokenHost: helpers.mergeVariables(details.tokenHost, configuration),
        tokenPath: helpers.mergeVariables(details.tokenPath, configuration),
        revokePath: helpers.mergeVariables(details.revokePath, configuration),
        authorizeHost: helpers.mergeVariables(details.authorizeHost, configuration),
        authorizePath: helpers.mergeVariables(details.authorizePath, configuration)
      }
    };
    console.log('creating oauth', credentials);
    return OAuth2.create(credentials);
  })

  app.get('/oauth/callback/2.0', async((req, res, next) => {
    console.log('callback hit', req.body, req.query, req.params);
  }))

  app.get('/oauth/authenticate/2.0/:service_auth_id/org/:organization_id', async((req, res, next) => {
    var serviceAuth = await(Models.ServiceAuth.findById(req.params.service_auth_id))
    var callbackUrl = `https://api.nativesync.io/oauth/callback/2.0/${serviceAuth.id}/org/${req.params.organization_id}`;
    var oauth2 = await(createOauth(serviceAuth, req.params.organization_id));
    var state = Guid.raw();
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: callbackUrl,
      scope: serviceAuth.scopes,
      state: state,
    });
    var orgAuth = {
      service_id: serviceAuth.service_id,
      service_auth_id: serviceAuth.id,
      organization_id: req.params.organization_id,
      values: {
        state: state
      }
    }
    await(Models.OrganizationAuth.upsert(orgAuth))
    return res.redirect(authorizationUri);
  }));

};
