'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var UserClient = postgres.define('user_client', {
  user_id: {
    type: Sequelize.INTEGER
  },
  client_id: {
    type: Sequelize.INTEGER
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['user_id', 'client_id'], unique: true}]
});

module.exports = UserClient
