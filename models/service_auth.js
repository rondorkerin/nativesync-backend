'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ServiceAuth = postgres.define('service_auth', {
  id: {
    type: Sequelize.BIGINT,
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
  indexes: [{fields: ['service_id']}]
});

module.exports = ServiceAuth
