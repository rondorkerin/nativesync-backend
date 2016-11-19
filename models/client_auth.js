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

ClientAuth._getAllForService = (client_id, service_name) => {
  return postgres.query(`select * from client_auth inner join service on service.id = client_auth.service_id where service.name = '${service_name}' and client_auth.client_id = ${client_id}`);
}

module.exports = ClientAuth
