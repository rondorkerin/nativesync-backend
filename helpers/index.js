module.exports = function(passport) {
  return {
    checkauth: require('./checkauth')(passport),
    passport: passport,
    mergeVariables: require('merge_variables'),
    internalize: (string) => {
      // turn a string into an internalized version
      return string.toLowerCase().replace(new RegExp('[^a-zA-Z0-9_]+', 'g'), '_');
    },
  }
}
