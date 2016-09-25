'use strict';

let config = require('config');
let r = require('rethinkdbdash')(config.get('rethinkdb'));

module.exports = r
