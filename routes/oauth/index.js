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
	require('./oauth2')(app, helpers);
	require('./oauth1')(app, helpers);
};
