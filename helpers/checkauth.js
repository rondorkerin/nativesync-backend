var config = require('config');
module.exports = function(passport) {
  return function(type) {
    if (type == 'organization') {
      return passport.authenticate('organization', { session: false});
    } else if (type == 'user' || !type) {
      return passport.authenticate('user', { session: false});
    } else if (type == 'userCookie') {
      return passport.authenticate('userCookie', { session: false});
    }
  };
};
