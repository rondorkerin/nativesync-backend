'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var ClientSystemAuth = postgres.define('client_system_auth', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  client_id: {
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

module.exports = ClientSystemAuth
