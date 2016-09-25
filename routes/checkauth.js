module.exports = function(passport) {
  return passport.authenticate('headerapikey', { session: false })
}
