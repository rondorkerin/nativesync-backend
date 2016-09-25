let passport = require('passport');
let ApiKeyStrategy = require('passport-headerapikey').default;
let config = require('config');
let Company = require('./models/company')

let express = require('express');
let app = express();

let server = require('http').createServer(app).listen(config.get('port'), function(req, res) {
  console.log('running on port', config.get('port'))
});

debugger;
passport.use(new ApiKeyStrategy(
  { header: 'Authorization', prefix: 'Api-Key ' },
  false,
  function(apikey, done) {
    Company.getByAPIKey(apikey)
		.then(function(result) {
			if (result) {
				done(null, result);
			} else {
				done('invalid api key');
			}
    });
  }
));

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
