'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ActionServiceAuth = postgres.define('action_service_auth', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  action_id: {
    type: Sequelize.BIGINT
  },
  service_auth_id: {
    type: Sequelize.BIGINT
  }
}, {
  freezeTableName: true
});

module.exports = ActionServiceAuth
