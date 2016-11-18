'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ServiceAuth = postgres.define('service_auth', {
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
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['service_id']}]
});

module.exports = ServiceAuth
