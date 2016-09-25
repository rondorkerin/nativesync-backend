'use strict';

let r = require('../drivers/rethinkdb');
let guid = require('guid');

exports.create = (name, url) => {
  let data = { name: name, url: url, apiKey: `o${guid.create().value}` };
  return r.db('nativesync').table('company').insert(data).run();
}

exports.getByAPIKey = (apiKey) => {
  return r.db('nativesync').table('company').getAll(apiKey, {index: 'apiKey'}).run()
  .then(function(result) {
    return result[0];
  })
}

exports.getAll = () => {
  return r.db('nativesync').table('company').run();
}
