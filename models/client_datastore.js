'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')

var ClientDatastore = postgres.define('client_datastore', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  client_id: {
    type: Sequelize.BIGINT
  },
  key: {
    type: Sequelize.STRING
  },
  value: {
    type: Sequelize.JSONB
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['client_id', 'key'], unique: true}]
});

module.exports = ClientDatastore
