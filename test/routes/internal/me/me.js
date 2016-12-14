var request = require('request-promise');
var fs = require('fs');
var token = fs.readFileSync('/tmp/token').toString().replace('\n', '');
var baseUrl = fs.readFileSync('/tmp/base_url').toString().replace('\n', '');

debugger;
request({
  json: true,
  uri: baseUrl + '/internal/me',
  headers: {'Token': token},
  body: { },
  method: 'GET',
})
.then(console.log);
