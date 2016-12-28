'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')

var OrganizationAuth = postgres.define('organization_auth', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  organization_id: {
    type: Sequelize.BIGINT
  },
  service_id: {
    type: Sequelize.BIGINT
  },
  service_auth_id: {
    type: Sequelize.BIGINT
  },
  value: {
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
  indexes: [{fields: ['organization_id', 'service_id']}, {fields: ['service_auth_id', 'organization_id'], unique: true}]
});

module.exports = OrganizationAuth
