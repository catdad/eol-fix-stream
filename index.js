/* jshint node: true */

var through = require('through2');

var allowedEol = {
  '\r': true,
  '\n': true,
  '\r\n': true
};

module.exports = function lfcrClean(eol) {
  if (!eol) {
    // Set a default
    eol = '\n';
  }

  if (!allowedEol[eol]) {
    throw new Error('Invalid EOL: "' + eol + '"');
  }

  var crlf = /\r\n|\n\r|\n|\r/g;
  var endCrlf = /\r|\n$/;
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
    if (prev) {
      cb(null, prev.replace(crlf, eol));
    }
  });
};
