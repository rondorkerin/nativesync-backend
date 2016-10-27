'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ClientAuth = postgres.define('client_auth', {
  client_id: {
    type: Sequelize.INTEGER
  },
  service_id: {
    type: Sequelize.INTEGER
  },
  service_auth_id: {
    type: Sequelize.INTEGER
  },
  value: {
    type: Sequelize.STRING
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['client_id', 'service_id']}]
});

module.exports = ClientAuth
