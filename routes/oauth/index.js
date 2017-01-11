'use strict'
var express = require('express');
var fs = require('fs');
var Models = require('../../models');
var _ = require('underscore');
var OAuth = require('oauth')

module.exports = function(app, helpers) {

  app.get('/oauth/authenticate/1.0/:service_auth_id', (req, res, next) => {
    console.log('callback URL hit', req.body, req.params.service_auth_id);
  })

  app.get('/oauth/authenticate/1.0/:service_auth_id', (req, res, next) => {
    return Models.ServiceAuth.findById(req.params.service_auth_id)
    .then((serviceAuth) => {
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

      console.log('getting oauth token', oa);
      oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
        if(error) console.log('error :' + error)
        else {
          console.log('oauth_token :' + oauth_token)
          console.log('oauth_token_secret :' + oauth_token_secret)
          console.log('requestoken results :' + util.inspect(results))
          console.log("Requesting access token")
          oa.getOAuthAccessToken(oauth_token, oauth_token_secret, function(error, oauth_access_token, oauth_access_token_secret, results2) {
            console.log('oauth_access_token :' + oauth_access_token)
            console.log('oauth_token_secret :' + oauth_access_token_secret)
            console.log('accesstoken results :' + util.inspect(results2))
            console.log("Requesting access token")
            /*
            var data= "";
            oa.getProtectedResource("http://term.ie/oauth/example/echo_api.php?foo=bar&too=roo", "GET", oauth_access_token, oauth_access_token_secret,  function (error, data, response) {
                console.log(data);
            });
            */
          });
        }
      })
    })
  });
};
