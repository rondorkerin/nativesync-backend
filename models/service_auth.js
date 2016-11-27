'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ClientAuth = require('./client_auth');
var ServiceAuth = postgres.define('service_auth', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  service_id: {
    type: Sequelize.BIGINT
  },
  type: {
    type: Sequelize.STRING
  },
  details: {
    type: Sequelize.JSON
  },
  required: {
    type: Sequelize.BOOLEAN
  },
  name: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['service_id']}, {fields: ['service_id', 'name'], unique: true}]
});

module.exports = ServiceAuth
