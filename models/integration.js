'use strict';

let r = require('../drivers/rethinkdb');

exports.upsert = (integration) => {
  if (integration.id) {
    return r.db('nativesync').table('integration').get(integration.id).update(integration).run();
  } else {
    return r.db('nativesync').table('integration').insert(clientAuth).run();
  }
}

exports.getAllForClient = (clientID) => {
  return r.db('nativesync').table('integration').getAll(clientID, {index: 'clientID'}).run();
}
