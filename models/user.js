'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var User = postgres.define('user', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
}, {
  freezeTableName: true
});

module.exports = User
