'use strict';
let Sequelize = require('sequelize');

let config = require('config');
let pg = config.get('postgres')
if (pg['use_env_variable']) {
	var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
	sequelize = new Sequelize(match[5], match[1], match[2], {
			dialect:  'postgres',
			protocol: 'postgres',
			port:     match[4],
			host:     match[3],
			logging: false,
			dialectOptions: {
					ssl: true
			}
	});
} else {
  var sequelize = new Sequelize(pg['database'], pg['username'], pg['password'], {
    host: pg['host'],
    dialect: 'postgres',
  });
}

module.exports = sequelize;
