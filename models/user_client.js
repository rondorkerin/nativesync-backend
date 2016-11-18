'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var UserClient = postgres.define('user_client', {
  user_id: {
    type: Sequelize.BIGINT
  },
  client_id: {
    type: Sequelize.BIGINT
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['user_id', 'client_id'], unique: true}]
});

module.exports = UserClient
