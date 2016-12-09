var request = require('request-promise');
var fs = require('fs');

request({
  json: true,
  uri: 'http://localhost:8083/internal/auth/login',
  body: {
    email: 'nick',
    password: 'fourtwo190'
  },
  method: 'POST',
})
.then((response) => {
  fs.writeFileSync('/tmp/token', response.token);
})
