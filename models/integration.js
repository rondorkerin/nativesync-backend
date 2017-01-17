'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize');
var Integration = postgres.define('integration', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  organization_id: {
    type: Sequelize.BIGINT
  },
  creator_user_id: {
    type: Sequelize.BIGINT
  },
  copied_from_id: {
    type: Sequelize.BIGINT
  },
  visibility: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  internal_name: {
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
  configuration: {
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
  },
  support_policy: {
    type: Sequelize.STRING
  },
  how_it_works: {
    type: Sequelize.TEXT
  },
  requirements: {
    type: Sequelize.TEXT
  }
}, {
  indexes: [{fields: ['organization_id', 'internal_name'], unique: true}, {fields: ['creator_user_id']}],
  freezeTableName: true
});

module.exports = Integration;
