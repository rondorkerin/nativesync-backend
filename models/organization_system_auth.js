'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var OrganizationSystemAuth = postgres.define('organization_system_auth', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  organization_id: {
    type: Sequelize.BIGINT,
  },
  token: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  indexes: [{fields: ['token', 'organization_id'], unique: true}],
  freezeTableName: true
});

module.exports = OrganizationSystemAuth
