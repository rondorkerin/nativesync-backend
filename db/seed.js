'use strict';

let Promise = require('bluebird')
let company = require('../models/company');

let run = () => {
  return Promise.all([
    return company.create('test', 'localhost:3000'),

  ])
}
