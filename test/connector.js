let request = require('request');
require('request-debug')(request);

var options = {
  uri: 'http://localhost:8083/connector/test/echo',
  method: 'POST',
  json: {
    "hello": "world",
    'test': 'struff'
  },
  headers: {
    'X-Api-Key': 'c7bbbba01-c03e-b3a4-478e-431aaf876b0f'
  }  
};

request(options, function (error, response, body) {
    debugger;
	console.log(body) // Print the shortened url.
});
