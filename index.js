/* jshint node: true */

var through = require('through2');
var assert = require('assert');

var allowedEol = ['\r', '\n', '\r\n'];

module.exports = function lfcrClean(options) {
  options = options || {};
  var eol = options.eol || '\n';

  if (!allowedEol.includes(eol)) {
    throw new Error('Invalid `eol` option: "' + eol + '"');
  }

  var crlf = /\r\n|\n\r|\n|\r/g;
  var endCrlf = /\r$|\n$/;
  var prev = '';

  return through(function (chunk, enc, cb) {
    var data = chunk.toString();

    if (prev) {
      data = prev + data;
    }

    if (endCrlf.test(data)) {
      prev = data.slice(-1);
      data = data.slice(0, -1);
    } else {
      prev = '';
    }
  
    // change any remaining cr or lf to eol
    data = data.replace(crlf, eol);

    cb(null, data);
  }, function (cb) {
    cb(null, prev.replace(crlf, eol));
  });
};
