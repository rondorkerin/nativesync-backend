'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')

var ClientAuth = postgres.define('client_auth', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  client_id: {
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
  indexes: [{fields: ['client_id', 'service_id']}, {fields: ['service_auth_id', 'client_id'], unique: true}]
});

module.exports = ClientAuth
