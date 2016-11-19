'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ClientAuth = postgres.define('client_auth', {
  id: {
    type: Sequelize.BIGINT,
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
  indexes: [{fields: ['client_id', 'service_id']}]
});


module.exports = ClientAuth
