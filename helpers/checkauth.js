module.exports = function(passport) {
  return function(type) {
    if (type == 'client') {
      passport.authenticate('client', { session: false, failureRedirect: '/auth/failure' })
    } else if (type == 'user' || !type) {
      passport.authenticate('user', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
      })
    }
  }
};
