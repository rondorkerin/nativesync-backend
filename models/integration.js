'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var Integration = postgres.define('integration', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  client_id: {
    type: Sequelize.BIGINT
  },
  type: {
    type: Sequelize.STRING
  },
  scheduling_info: {
    type: Sequelize.JSON
  },
  integration: {
    type: Sequelize.TEXT
  },
}, {
  freezeTableName: true
});

module.exports = Integration
