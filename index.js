'use strict'
let passport = require('passport');
let config = require('config');

require('use-strict')
var Models = require('./models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
let express = require('express');
var Auth = require('./services/auth')
var bearerToken = require('express-bearer-token')
var cors = require('cors')
var bodyParser = require('body-parser');

let app = express();

app.set('port', (process.env.PORT || config.get('port')))

let server = require('http').createServer(app).listen(app.get('port'), function(req, res) {
  console.log('running on port', config.get('port'))
});

app.use(passport.initialize())

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())
app.use(bearerToken())


async(function(){
  var auth = await(Auth(
    await(Models['User'].findAll()),
    await(Models['UserSystemAuth'].findAll()),
    await(Models['UserSystemAuth'].findAll()),
    async((x) => { console.log(x); await(Models['User'].upsert(x)); return Models['User'].findOne(x.id); }),
    async((x) => { console.log(x); await(Models['UserSystemAuth'].upsert(x)); return Models['UserSystemAuth'].findOne(x.id); }),
    async((x) => { console.log(x); await(Models['UserSystemAuth'].upsert(x)); return Models['UserSystemAuth'].findOne(x.id); })
  ))

  require('./routes')(app,auth);
})()
