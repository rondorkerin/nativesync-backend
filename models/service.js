'use strict';

let r = require('../drivers/rethinkdb');

exports.create = (name, driver, spec) => {
  return r.db('nativesync').table('service').insert({name: name, driver: driver, spec: spec}).run();
}


exports.get = (name) => {
  return r.db('nativesync').table('service').getAll(name, {index: 'name'}).run()
}
