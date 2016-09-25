let Promise = require('bluebird');

class Test {
  constructor(userAuth) {
  }

  hello(args) {
    return Promise.resolve({ response: 'world' })
  }

  echo(args) {
    return Promise.resolve(args)
  }

}

module.exports = Test
