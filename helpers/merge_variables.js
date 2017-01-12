module.exports = function(string, configuration) {
  if (string === null) {
    return string;
  }
  for (var key in configuration) {
    string = string.replace(`{${key}}`, configuration[key]);
  }
  return string;
};
