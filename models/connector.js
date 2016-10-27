'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var Connector = postgres.define('connector', {
  service_id: {
    type: Sequelize.INTEGER
  },
  creator_user_id: {
    type: Sequelize.INTEGER
  },
  service_name: {
    type: Sequelize.STRING,
  },
  function_name: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING
  },
  configuration: {
    type: Sequelize.JSON
  },
  input: {
    type: Sequelize.JSON
  },
  output: {
    type: Sequelize.JSON
  },
  official: {
    type: Sequelize.BOOLEAN 
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['function_name'], unique: true}, {fields: ['service_id']}, {fields: ['service_name', 'function_name']}, {fields: ['creator_user_id']}]
});

module.exports = Connector
