var workers = [
  require('./integration_runner')
]

module.exports = () => {
  workers.forEach((index) => {
    console.log('running worker', index);
    workers[index]();
  })
};
