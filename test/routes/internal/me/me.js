var request = require('request-promise');
var fs = require('fs');
var token = fs.readFileSync('/tmp/token');

request({
  json: true,
  uri: 'http://localhost:8083/internal/me',
  headers: {'Token': token},
  body: { },
  method: 'GET',
})
.then(console.log);
