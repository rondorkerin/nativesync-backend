'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var Client = postgres.define('client', {
  partner_id: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  api_key: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['partner_id']}, {fields: ['api_key'], unique: true}]
});

module.exports = Client
