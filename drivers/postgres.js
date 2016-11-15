'use strict';
let Sequelize = require('sequelize');

let config = require('config');
let pg = config.get('postgres')
if (pg['env_variable']) {
  var sequelize = new Sequelize(process.env[pg['env_variable']])
} else {
  var sequelize = new Sequelize(pg['database'], pg['username'], pg['password'], {
    host: pg['host'],
    dialect: 'postgres',
  });
}

module.exports = sequelize;
