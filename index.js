let passport = require('passport');
let HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
let config = require('config');

let express = require('express');
let app = express();

let server = require('http').createServer(app).listen(config.get('port'), function(req, res) {
  console.log('running on port', config.get('port'))
});

app.use(passport.initialize()) 

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

require('./routes')(app, passport);

passport.use(new HeaderAPIKeyStrategy(
  {header: 'X-Api-Key', prefix: ''},
  false,
  function(apikey, done) {
    if (apikey[0] == 'o') {
      var model = require('./models/company');
    } else {
      var model = require('./models/client')
    }
    model.getByAPIKey(apikey)
		.then(function(result) {
			if (result) {
        if (apikey[0] == 'o') {
          result['company'] = true;
        } else {
          result['client'] = true;
        }
				done(null, result);
			} else {
				done('invalid api key');
			}
    });
  }
));
