'use strict'
var express = require('express');
var fs = require('fs');
var Models = require('../../models');
var _ = require('underscore');
var OAuth = require('oauth')
var OAuth2 = require('simple-oauth2');
var await = require('asyncawait/await');
var async = require('asyncawait/async');

module.exports = function(app, helpers) {
  app.get('/oauth/1.0/callback/:service_auth_id', helpers.checkauth('userCookie'), (req, res, next) => {
    // todo: org id
    var organizationId = req.user.org.id;;
    console.log('callback URL hit', req.body, req.query, req.params);
    var resultParams = req.query;
    console.log('req query', req.query);
    var serviceAuth = await(Models.ServiceAuth.findById(req.params.service_auth_id))
    console.log("Requesting access token")
    var oa = new OAuth.OAuth(
      serviceAuth.details.requestTokenUrl,
      serviceAuth.details.accessTokenRequestUrl,
      serviceAuth.details.consumerKey,
      serviceAuth.details.consumerSecret,
      "1.0",
      null,
      serviceAuth.details.signatureMethod
    )
    oa.getOAuthAccessToken(
      serviceAuth.details.oauthToken,
      serviceAuth.details.oauthTokenSecret,
      req.query.oauth_verifier,
      async(function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      console.log('acces token', oauthAccessToken, oauthAccessTokenSecret);
      // grab the params out of req.query and shove them into the organizationAuth object.
      var serviceId = serviceAuth.service_id;
      var serviceAuthId = serviceAuth.id;
      var organizationAuth = {
        organization_id: organizationId,
        service_id: serviceId,
        service_auth_id: serviceAuthId,
        value: Object.assign(req.query, {
          oauthAccessToken: oauthAccessToken,
          oauthAccessTokenSecret: oauthAccessTokenSecret,
          consumerKey: serviceAuth.details.consumerKey,
          consumerSecret: serviceAuth.details.consumerSecret,
        })
      }
      var existing = await(Models.OrganizationAuth.findOne({where: {organization_id: organizationId, service_id: serviceId, service_auth_id: serviceAuthId}}));
      console.log('existing org auth', existing);
      if (existing) {
        existing.value = organizationAuth.value;
        await(existing.save());
      } else {
        await(Models.OrganizationAuth.create(organizationAuth));
      }
      console.log('returning')
      return res.send('authentication success');
    }));
  })

  app.get('/oauth/1.0/authenticate/:service_auth_id', helpers.checkauth('userCookie'), (req, res, next) => {
    var organizationId = req.user.org.id;;
    var serviceAuth = await(Models.ServiceAuth.findById(req.params.service_auth_id))
    var callbackURL = `https://api.nativesync.io/oauth/callback/1.0/${serviceAuth.id}`;
    var oa = new OAuth.OAuth(
      serviceAuth.details.requestTokenUrl,
      serviceAuth.details.accessTokenRequestUrl,
      serviceAuth.details.consumerKey,
      serviceAuth.details.consumerSecret,
      "1.0",
      callbackURL,
      serviceAuth.details.signatureMethod
    )

    oa.getOAuthRequestToken(async(function(error, oauthToken, oauthTokenSecret, results) {
      if (error) {
        console.log('error :' + error)
      } else {
        console.log('oauth_token :' + oauthToken)
        console.log('oauth_token_secret :' + oauthTokenSecret)
        var details = serviceAuth.details;
        details.oauthTokenSecret = oauthTokenSecret;
        details.oauthToken = oauthToken;
        serviceAuth.details = details;
        await(serviceAuth.save());
        console.log('redirecting user to auth screen');
        res.redirect(`${details.authUrl}?oauth_token=${oauthToken}`)
      }
    }))
  });
};
