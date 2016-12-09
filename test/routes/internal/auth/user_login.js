var request = require('request-promise');

request({
  json: true,
  uri: 'http://localhost:8083/internal/auth/login',
  body: {
    email: 'nick',
    password: 'fourtwo190'
  },
  method: 'POST',
})
.then(console.log);
