var express = require('express');
var fs = require('fs');
var Models = require('../../models');
var _ = require('underscore');
var OAuth = require('node-oauth').OAuth

module.exports = function(app, helpers) {
  var oauthRouter = express.Router();
  app.use('/oauth', oauthRouter);

  // allow CORS
  oauthRouter.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  oauthRouter.get('authenticate/1.0/:service_auth_id', (req, res, next) => {
    return Models.ServiceAuth.findById(params.service_auth_id)
    .then((serviceAuth) => {
      var oa = new OAuth(
        serviceAuth.details.requestTokenUrl,
        serviceAuth.details.accessTokenRequestUrl,
        serviceAuth.details.consumerKey,
        serviceAuth.details.consumerSecret,
        "1.0",
        null,
        serviceAuth.details.signatureMethod)

      oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
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
            var data= "";
            oa.getProtectedResource("http://term.ie/oauth/example/echo_api.php?foo=bar&too=roo", "GET", oauth_access_token, oauth_access_token_secret,  function (error, data, response) {
                console.log(data);
            });
          });
        }
      })
    })
  });
};