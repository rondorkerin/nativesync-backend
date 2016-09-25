'use strict';

let r = require('../drivers/rethinkdb');

exports.upsert = (clientAuth) => {
  if (clientAuth.id) {
    return r.db('nativesync').table('clientAuth').get(clientAuth.id).update(clientAuth).run();
  } else {
    return r.db('nativesync').table('clientAuth').insert(clientAuth).run();
  }
}

exports.getAllForClient = (clientID) => {
  return r.db('nativesync').table('clientAuth').getAll(clientID, {index: 'clientID'}).run();
}

exports.getForClient = (clientID, service) => {
  return r.db('nativesync').table('clientAuth').getAll(clientID, {index: 'clientID'})
    .filter({service: service}).run()
  .then(function(clientAuthList) {
    debugger;
    return clientAuthList[0];
  })
}
