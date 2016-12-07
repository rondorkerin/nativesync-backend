'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var ServiceDefinition = postgres.define('service_definition', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  service_id: {
    type: Sequelize.BIGINT
  },
  definition: {
    type: Sequelize.JSON
  },
  name: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['service_id', 'name'], unique: true}]
});

module.exports = ServiceDefinition
