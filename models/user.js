'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize');
let guid = require('guid');
var User = postgres.define('user', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  avatar_url: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  default_organization_id: {
    type: Sequelize.BIGINT
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  indexes: [{fields: ['email'], unique: true}],
  freezeTableName: true
});

module.exports = User;
