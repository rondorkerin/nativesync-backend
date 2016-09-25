'use strict';

let r = require('../drivers/rethinkdb');
let guid = require('guid');

exports.create = (companyID, name, url) => {
  debugger;
  let data = { companyID: companyID, name: name, url: url, apiKey: `c${guid.create().value}` };
  return r.db('nativesync').table('client').insert(data).run();
}

exports.getByAPIKey = (apiKey) => {
  return r.db('nativesync').table('client').getAll(apiKey, {index: 'apiKey'}).run()
  .then(function(result) {
    return result[0];
  })
}

exports.getAll = () => {
  return r.db('nativesync').table('client').run();
}
