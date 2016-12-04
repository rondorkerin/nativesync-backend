'use strict';

const stormpath = require('stormpath');
const client = new stormpath.Client();
const Promise = require('bluebird');

Promise.promisifyAll(client);

module.exports = client;
