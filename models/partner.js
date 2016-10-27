'use strict';

let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize')
let guid = require('guid');
var Partner = postgres.define('partner', {
  name: {
    type: Sequelize.STRING
  },
}, {
  freezeTableName: true
});

module.exports = Partner
