'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
var Integration = postgres.define('integration', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  partner_id: {
    type: Sequelize.BIGINT
  },
  creator_user_id: {
    type: Sequelize.BIGINT
  },
  title: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  version: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  language: {
    type: Sequelize.STRING
  },
  scheduling_info: {
    type: Sequelize.JSON
  },
  documentation: {
    type: Sequelize.TEXT
  },
  privacy: {
    type: Sequelize.STRING
  },
  pricing: {
    type: Sequelize.JSON
  },
  onboarding: {
    type: Sequelize.JSON
  },
  required_service_auth_ids: {
    type: Sequelize.JSON
  },
  referrals: {
    type: Sequelize.JSON
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true
});

module.exports = Integration
