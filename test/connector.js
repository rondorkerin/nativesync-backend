let request = require('request');
require('request-debug')(request);
var apikey = require('./apikey');

var options = {
  uri: 'http://localhost:8083/connector/test/echo',
  method: 'POST',
  json: {
    "hello": "world",
    'test': 'struff'
  },
  headers: {
    'X-Api-Key': apikey 
  }  
};

request(options, function (error, response, body) {
    debugger;
	console.log(body) // Print the shortened url.
});
