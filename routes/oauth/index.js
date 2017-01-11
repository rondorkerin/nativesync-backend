'use strict'
var express = require('express');
var fs = require('fs');
var Models = require('../../models');
var _ = require('underscore');
var OAuth = require('oauth')
var await = require('asyncawait/await');
var async = require('asyncawait/async');

module.exports = function(app, helpers) {

  app.get('/oauth/callback/1.0/:service_auth_id', (req, res, next) => {
    console.log('callback URL hit', req.body);
    var serviceAuth = await(Models.ServiceAuth.findById(req.params.service_auth_id))
    console.log("Requesting access token")
    var oa = new OAuth.OAuth(
      serviceAuth.details.requestTokenUrl,
      serviceAuth.details.accessTokenRequestUrl,
      serviceAuth.details.consumerKey,
      serviceAuth.details.consumerSecret,
      "1.0",
      callbackURL,
      serviceAuth.details.signatureMethod
    )
    oa.getOAuthAccessToken(serviceAuth.details.oauthToken, serviceAuth.details.oauthTokenSecret,
      async(function(error, oauthAccessToken, oauthAccessTokenSecret, results2) {
      console.log('accesstoken results :', (results2))
      console.log('acces token', oauthAccessToken, oauthAccessTokenSecret);
    }));
  })

  app.get('/oauth/authenticate/1.0/:service_auth_id', async((req, res, next) => {
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
  }));
};
