'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var Service = postgres.define('service', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  domain: {
    type: Sequelize.STRING,
    unique: true
  },
  logo_url: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['name']}]
});

module.exports = Service
