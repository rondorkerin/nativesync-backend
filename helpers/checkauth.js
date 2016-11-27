module.exports = function(passport) {
  return function(type) {
    if (type == 'client') {
      return passport.authenticate('client', { session: false, failureRedirect: '/auth/failure' })
    } else if (type == 'user' || !type) {
      debugger;
      return passport.authenticate('user', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
      })
    }
  }
};
