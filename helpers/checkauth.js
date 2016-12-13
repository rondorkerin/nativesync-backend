var config = require('config');
module.exports = function(passport) {
  return function(type) {
    if (type == 'client') {
      return passport.authenticate('client', { session: false})
    } else if (type == 'user' || !type) {
      return passport.authenticate('user', { session: false})
    }
  }
};
