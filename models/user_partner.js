'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var UserPartner = postgres.define('user_partner', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true
  },
  user_id: {
    type: Sequelize.BIGINT
  },
  partner_id: {
    type: Sequelize.BIGINT
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['user_id', 'partner_id'], unique: true}]
});

module.exports = UserPartner;
