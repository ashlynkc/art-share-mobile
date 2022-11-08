const { sha256 } = require('js-sha256');

exports.hash = function hash(string) {
  return sha256(string);
}