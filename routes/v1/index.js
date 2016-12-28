const async = require('asyncawait/async');
const await = require('asyncawait/await');
const HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const config = require('config');
const express = require('express');

module.exports = function(app, helpers) {
  helpers.passport.use('organization', new HeaderApiKeyStrategy({
    header: 'Api-Key', prefix: '', session: false},
    false,
    async((apikey, done) => {
      var organization = await(app.Models.Organization.findOne({where: {api_key: apikey}}));
      if (!organization) {
        return done('invalid organization API key', null);
      }
      return done(null, organization);
    })
  ));

  var v1Router = express.Router();
  app.use('/v1', v1Router);

  require('./me')(v1Router, helpers);
  require('./integration')(v1Router, helpers);
  require('./action')(v1Router, helpers);
};
