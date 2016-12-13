var config = require('config');
module.exports = function(passport) {
  return function(type) {
    if (type == 'client') {
      return passport.authenticate('client', { session: false, failureRedirect: '/auth/failure' })
    } else if (type == 'user') {
      return passport.authenticate('user', { session: false, failureRedirect: '/auth/failure' })
    }
  }
};
