const Models = require('../../models')
const Action = Models.Action
const ClientAuth = Models.ClientAuth
const Promise = require('bluebird');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const uuid = require('node-uuid')
const validator = require('validator');
const bcrypt = require('bcryptjs')
const Hash = Promise.promisify(bcrypt.hash)
const Compare  = Promise.promisify(bcrypt.compare)
const jwt = require('jwt-simple');
const HeaderApiKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy;
const config = require('config');
const JWT_SECRET = config.get('jwt_secret');

module.exports = (app, helpers) => {
  helpers.passport.use('user', new HeaderApiKeyStrategy({
    header: 'Token' , prefix: '', session: false},
    false,
    async((apikey, done) => {
      console.log('payload found', apikey);
      var payload = jwt.decode(apikey, JWT_SECRET);
      if (!payload.id) {
        return done('invalid client Token', null);
      } else {
        var user = await(Models.User.findById(payload.id));
        return done(null, user);
      }
    })
  ));

  //anyone can access this route
  app.post('/auth/signup', async ((req, res, next) => {
    var password = req.body.password;
    var accountType = req.body.accountType ? req.body.accountType : 'partner';
    var email = req.body.email;
    email = validator.normalizeEmail(email);
    var companyName = req.body.companyName ? req.body.companyName : email;
    if (!validator.isEmail(email)) {
      return res.status(400).send('the email provided was invalid');
    }
    let existing;
    if (accountType == 'partner') {
      existing = await(Models.Partner.findOne({where: {name: companyName}}));
    } else {
      existing = await(Models.Client.findOne({where: {name: companyName}}));
    }
    if (existing) {
      return res.status(400).send('a company already exists with that company name');
    }
    try {
      var user = await(Models.User.create({email: email}));
      var hash = await(Hash(password,10));
      var userSystemAuth = await(Models.UserSystemAuth.create({user_id: user.id, hash: hash}));
      if (accountType == 'partner') {
        let partner = await(Models.Partner.create({name: companyName}))
        await(Models.UserPartner.create({user_id: user.id, partner_id: partner.id}));
      } else {
        let client = await(Models.Client.create({name: companyName}))
        await(Models.UserClient.create({user_id: user.id, client_id: client.id}));
      }
      return res.json(user)
    } catch(e) {
      console.log('exception', e);
      return res.status(400).send('a user already exists with that email');
    }
  }));

  //anyone can access this route
  app.post('/auth/login', async((req, res, next) => {
    var password = req.body.password;
    var email = req.body.email;
    if (validator.isEmail(email)) {
      email = validator.normalizeEmail(email);
      var user = await(Models.User.findOne({where: {email: email}}));
      if (user) {
        var userSystemAuth = await(Models.UserSystemAuth.findOne({where: {user_id: user.id}}));
        if (await(Compare(password, userSystemAuth.hash))) {
          userSystemAuth.token = jwt.encode({id: user.id}, JWT_SECRET);
          await(userSystemAuth.save());
          return res.json({token: userSystemAuth.token});
        }
      }
      return res.status(401).send('invalid credentials');
    } else {
      return res.status(401).send('invalid email');
    }
  }));

  app.post('/auth/logout', helpers.checkauth('user'), (req, res) => {
    console.log('logout called for user', req.user);
    var systemAuth = await(Models.UserSystemAuth.findOne({where: {user_id: req.user.id}}))
    systemAuth.token = '';
    await(systemAuth.save());
    return res.send('success');
  });

  app.post('/auth/user', helpers.checkauth('user'), (req,res) => {
    return res.json(req.user)
  })

  app.post('/auth/changePassword', helpers.checkauth('user'), (req, res) => {
    return res.status(400).send('notimplemented');
  });
}
