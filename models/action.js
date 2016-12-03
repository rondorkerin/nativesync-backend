'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')

var Action = postgres.define('action', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  service_id: {
    type: Sequelize.BIGINT
  },
  title: {
    type: Sequelize.STRING
  },
  api_version: {
    type: Sequelize.STRING
  },
  schemes: {
    type: Sequelize.JSON
  },
  headers: {
    type: Sequelize.JSON
  },
  query: {
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
    type: Sequelize.BIGINT
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
  input_example: {
    type: Sequelize.JSON
  },
  output_example: {
    type: Sequelize.JSON
  },
  official: {
    type: Sequelize.BOOLEAN
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['function_name'], unique: true}, {fields: ['service_id']}, {fields: ['service_name', 'function_name'], unique: true}, {fields: ['creator_user_id']}]
});

module.exports = Action
