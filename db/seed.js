'use strict';

let Promise = require('bluebird')
let company = require('../models/company');
let client = require('../models/client');
let service = require('../models/service');

module.exports.run = () => {
  debugger;
  return company.create('test', 'localhost:3000')
  .then(function(result) {
    debugger;
    return client.create(result.generated_keys[0], 'test', 'localhost:3000')
  })
  .then(function() {
    return service.create('test', 'custom', {});
  })
}

