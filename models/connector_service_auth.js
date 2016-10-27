'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ConnectorServiceAuth = postgres.define('connector_service_auth', {
  connector_id: {
    type: Sequelize.INTEGER
  },
  service_auth_id: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true
});

module.exports = ConnectorServiceAuth
