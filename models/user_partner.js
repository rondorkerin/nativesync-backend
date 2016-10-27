'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var UserPartner = postgres.define('user_partner', {
  user_id: {
    type: Sequelize.INTEGER
  },
  partner_id: {
    type: Sequelize.INTEGER
  },
}, {
  freezeTableName: true,
  indexes: [{fields: ['user_id', 'partner_id'], unique: true}]
});

module.exports = UserPartner;
