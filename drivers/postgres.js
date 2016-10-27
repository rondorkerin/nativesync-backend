'use strict';
let Sequelize = require('sequelize');

let config = require('config');
let pg = config.get('postgres')
var sequelize = new Sequelize(pg['database'], pg['username'], pg['password'], {
  host: pg['host'],
  dialect: 'postgres',
});

module.exports = sequelize;
