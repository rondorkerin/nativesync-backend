const async = require('asyncawait/async');
const await = require('asyncawait/await');
const HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const config = require('config');
const express = require('express');

module.exports = function(app, helpers) {
  helpers.passport.use('client', new HeaderApiKeyStrategy({
    header: 'Authorization', prefix: 'Api-Key ', session: false},
    false,
    async(function(apikey, done) {
      var client = await(app.Models.Client.findOne({where: {api_key: apikey}}));
      if (!client) {
        return done('invalid client API key', null);
      }
      return done(null, client);
    })
  ));

  var v1Router = express.Router();
  app.use('/v1', v1Router);

  require('./me')(v1Router, helpers);
  require('./integration')(v1Router, helpers);
  require('./action')(v1Router, helpers);
};
