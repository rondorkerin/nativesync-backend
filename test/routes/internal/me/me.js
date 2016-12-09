var request = require('request-promise');

request({
  json: true,
  uri: 'http://localhost:8083/internal/me',
  headers: {'Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjcifQ.22pW-alT6rfJfphFCyYX4eWA4CIYK9uLGkkDnd0Mrlo'},
  body: { },
  method: 'GET',
})
.then(console.log);
