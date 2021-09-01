/* jshint node: true */

var Transform = require('stream').Transform;

var allowedEol = {
  '\r': true,
  '\n': true,
  '\r\n': true
};

module.exports = function lfcrClean(options) {
  options = options || {};
  var eol = options.eol || '\n';

  if (!allowedEol[eol]) {
    throw new Error('Invalid `eol` option: "' + eol + '"');
  }

  var crlf = /\r\n|\n\r|\n|\r/g;
  var endCrlf = /\r$|\n$/;
  var prev = '';

  var stream = new Transform();
  stream._transform = function (chunk, enc, cb) {
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
  };
  stream._flush = function (cb) {
    if (prev) {
      cb(null, prev.replace(crlf, eol));
    } else {
      cb();
    }
  };

  return stream;
};
