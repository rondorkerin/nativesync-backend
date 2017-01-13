'use strict'
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const config = require('config');
const express = require('express');

module.exports = function(app, helpers) {
  helpers.passport.use('organization', new HeaderApiKeyStrategy({
    header: 'X-Api-Key', prefix: '', session: false},
    false,
    async((apikey, done) => {
      var organizationSystemAuth = await(app.Models.OrganizationSystemAuth.findOne({
        where: {token: apikey},
        include: [app.Models.Organization]
      }));
      var organization = organizationSystemAuth.organization;
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
