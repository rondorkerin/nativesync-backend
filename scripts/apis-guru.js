var Async = require('async');
var Request = require('request');
var FS = require('fs');

var API_DIR = 'action_specs/swagger';

Request.get('https://api.apis.guru/v2/list.json', {json: true}, function(err, resp, body) {
  Async.parallel(Object.keys(body).map(function(key) {
    return function(callback) {
      var connKey = 'guru:' + key;
      var api = body[key].versions[body[key].preferred];
      var filename = API_DIR + '/' + connKey + '.json';
      Request.get(api.swaggerUrl, {json: true}, function(err, resp, body) {
        if (err || resp.statusCode >= 400) return callback(err || resp.statusCode + JSON.stringify(body));
        FS.writeFileSync(filename, JSON.stringify({
          type: 'api',
          key: connKey,
          info: body.info,
          public: true,
          swagger: body}, null, 2));
        callback();
      })
    }
  }), function(err) {
    if (err) throw err;
  })
})
