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
    console.log('callback URL hit', req.body, req.params.service_auth_id);
  })

  app.get('/oauth/authenticate/1.0/:service_auth_id', async((req, res, next) => {
    var serviceAuth = await(Models.ServiceAuth.findById(req.params.service_auth_id))
    var callbackURL = `/oauth/callback/1.0/${serviceAuth.id}`;
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
        serviceAuth.details.oauthTokenSecret = oauthTokenSecret;
        serviceAuth.details.oauthToken = oauthToken;
        await(serviceAuth.save());
        console.log('requestoken results :', results)
        console.log("Requesting access token")
        oa.getOAuthAccessToken(oauthToken, oauthTokenSecret, async(function(error, oauthAccessToken, oauthAccessTokenSecret, results2) {
          console.log('accesstoken results :', (results2))
          console.log('acces token', oauthAccessToken, oauthAccessTokenSecret);
        }));
      }
    }))
  }));
};
