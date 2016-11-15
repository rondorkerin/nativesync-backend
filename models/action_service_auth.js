'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ActionServiceAuth = postgres.define('action_service_auth', {
  action_id: {
    type: Sequelize.INTEGER
  },
  service_auth_id: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true
});

module.exports = ActionServiceAuth
