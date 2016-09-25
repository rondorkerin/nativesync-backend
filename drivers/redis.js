var config = require('./config')
console.log('loading ioredis');
var Redis = require('ioredis');

var redis = new Redis(config.redis);
module.exports = redis;
