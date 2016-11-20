'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var UserSystemAuth = postgres.define('user_system_auth', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.BIGINT,
  },
  token: {
    type: Sequelize.STRING,
  },
  hash: {
    type: Sequelize.STRING
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

module.exports = UserSystemAuth
