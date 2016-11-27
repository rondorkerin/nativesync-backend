'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ActionServiceAuth = postgres.define('action_service_auth', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  action_id: {
    type: Sequelize.BIGINT
  },
  service_auth_id: {
    type: Sequelize.BIGINT
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['action_id', 'service_auth_id'], unique: true}]
});

module.exports = ActionServiceAuth
