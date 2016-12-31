'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var Organization = postgres.define('organization', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  partner_id: {
    type: Sequelize.BIGINT
  },
  name: {
    type: Sequelize.STRING
  },
  passphrase: {
    type: Sequelize.STRING
  },
  logo_url: {
    type: Sequelize.STRING
  },
  api_key: {
    type: Sequelize.STRING
  },
  url: {
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
  indexes: [{fields: ['partner_id']}, {fields: ['api_key'], unique: true}]
});

module.exports = Organization
