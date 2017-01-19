'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize');
var IntegrationRequest = postgres.define('integration_request', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  organization_id: {
    type: Sequelize.BIGINT
  },
  assigned_organization_id: {
    type: Sequelize.BIGINT
  },
  jobStatus: {
    type: Sequelize.STRING
  },
  services: {
    type: Sequelize.JSON
  },
  steps: {
    type: Sequelize.JSON
  },
  consultantLevel: {
    type: Sequelize.STRING
  },
  newServices: {
    type: Sequelize.JSON
  },
  discount: {
    type: Sequelize.FLOAT
  },
  discountCode: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  },
}, {
  indexes: [{fields: ['organization_id']}, {fields: ['assigned_organization_id']}],
  freezeTableName: true
});

module.exports = Integration;
