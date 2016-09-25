'use strict';

let config = require('config');
let seed = require('./seed');
var r = require('rethinkdb');
require('rethinkdb-init')(r);
console.log(config.get('rethinkdb'))
 
r.init(config.get('rethinkdb')['servers'][0], [
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
      indexes: ['companyID', 'apiKey']
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
    {
      name: 'service',
      indexes: ['name']
    },
    {
      name: 'clientDatastore',
      indexes: ['clientID']
    },
  ]
)
.then(function (conn) {
	console.log('all tables created')
  return seed.run()
});

