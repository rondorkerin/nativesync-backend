module.exports = function() {
  return function(req, res, next) {
    // authentication middleware
    req.client = { id: 1 }
    req.user = { id: 1 }
    next();
  }
}
