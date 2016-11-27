module.exports = function(passport) {
  return {
    checkauth: require('./checkauth')(passport),
    passport: passport
  }
}
