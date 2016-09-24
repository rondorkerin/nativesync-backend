'use strict';

let config = require('config');
let r = require('rethinkdbdash')();

r.connect(config.get('rethinkdb'));

module.exports = r
