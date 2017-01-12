'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
let ServiceAuth = require('./service_auth');
var Service = postgres.define('service', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  copied_from_id: {
    type: Sequelize.BIGINT
  },
  organization_id: {
    type: Sequelize.BIGINT
  },
  visibility: {
    type: Sequelize.STRING
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
  },
  api_base_urls: {
    type: Sequelize.JSON
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['name']}]
});

module.exports = Service
