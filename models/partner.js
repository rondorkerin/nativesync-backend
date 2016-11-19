'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var Partner = postgres.define('partner', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  name: {
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

module.exports = Partner
