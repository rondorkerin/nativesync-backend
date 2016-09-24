'use strict';

let config = require('config');
var r = require('rethinkdb');
require('rethinkdb-init')(r);
console.log(config.get('rethinkdb'))
 
r.init(config.get('rethinkdb'), [
    {
      name: 'user',
      indexes: ['companyID']
    },
    {
      name: 'company',
      indexes: ['apiKey']
    },
    {
      name: 'client',
      indexes: ['companyID']
    },
    {
      name: 'connector',
      indexes: ['name']
    },
    {
      name: 'integration',
      indexes: ['clientID']
    },
    {
      name: 'clientAuth',
      indexes: ['clientID']
    },
  ]
)
.then(function (conn) {
	console.log('all tables created', conn)
});

