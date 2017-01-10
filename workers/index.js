'use strict'
var workers = [
  require('./integration_runner')
]

module.exports = () => {
  workers.forEach((worker) => {
    console.log('running worker', worker);
    worker();
  })
};
