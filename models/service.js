'use strict';

let r = require('../drivers/rethinkdb');

exports.create = (name, driver, spec, triggers, actions, auth) => {
  return r.db('nativesync').table('service').insert({name: name, driver: driver, spec: spec, triggers: triggers, actions: actions, auth: auth}).run();
}

exports.upsert = (service) => {
  return exports.get(service.name).then((existing) => {
    if (existing) {
      return r.db('nativesync').table('service').get(existing['id']).update(service).run();
    } else {
      return r.db('nativesync').table('service').insert(service).run();
    }
  })
}

exports.getAll = () => {
  return r.db('nativesync').table('service').run()
}


exports.get = (name) => {
  return r.db('nativesync').table('service').getAll(name, {index: 'name'}).run()
  .then((result) => {
    return result[0];
  })
}
