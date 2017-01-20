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
  billing_organization_id: {
    type: Sequelize.BIGINT
  },
  managing_organization_id: {
    type: Sequelize.BIGINT
  },
  external_identifier: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  overview_copy: {
    type: Sequelize.TEXT
  },
  contact_name: {
    type: Sequelize.STRING
  },
  contact_phone: {
    type: Sequelize.STRING
  },
  contact_email: {
    type: Sequelize.STRING
  },
  discountCode: {
    type: Sequelize.STRING
  },
  passphrase: {
    type: Sequelize.STRING
  },
  logo_url: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  stripe_customer_id: {
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
  indexes: [{fields: ['partner_id']}, {fields: ['api_key'], unique: true}, {fields: ['discountCode'], unique: true}]
});

module.exports = Organization
