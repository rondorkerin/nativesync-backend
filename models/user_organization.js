'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var UserOrganization = postgres.define('user_organization', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.BIGINT
  },
  organization_id: {
    type: Sequelize.BIGINT
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['user_id', 'organization_id'], unique: true}]
});

module.exports = UserOrganization
