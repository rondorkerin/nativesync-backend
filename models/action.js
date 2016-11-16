'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var Action = postgres.define('action', {
  service_id: {
    type: Sequelize.INTEGER
  },
  schemes: {
    type: Sequelize.JSON
  },
  headers: {
    type: Sequelize.JSON
  },
  host: {
    type: Sequelize.STRING
  },
  path: {
    type: Sequelize.STRING
  },
  method: {
    type: Sequelize.STRING
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
  input_content_type: {
    type: Sequelize.STRING
  },
  output_content_type: {
    type: Sequelize.STRING
  },
  version: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
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

module.exports = Action
