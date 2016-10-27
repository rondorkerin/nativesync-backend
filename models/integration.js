'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var Integration = postgres.define('integration', {
  client_id: {
    type: Sequelize.INTEGER
  },
  type: {
    type: Sequelize.STRING
  },
  scheduling_info: {
    type: Sequelize.JSON
  },
  integration: {
    type: Sequelize.JSON
  },
}, {
  freezeTableName: true
});

module.exports = Integration
