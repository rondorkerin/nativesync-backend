'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
// TODO: need an "active" and "inactive" boolean
var IntegrationCode = postgres.define('integration_code', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  integration_instance_id: {
    type: Sequelize.BIGINT
  },
  integration_id: {
    type: Sequelize.BIGINT
  },
  code: {
    type: Sequelize.TEXT
  },
  workflow: {
    type: Sequelize.JSON
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  indexes: [{fields: ['integration_instance_id'], unique: true}],
  freezeTableName: true
});

module.exports = IntegrationCode
