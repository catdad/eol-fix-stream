/* jshint node: true */

var through = require('through2');

module.exports = function lfcrClean() {
  var endsInLf = false;

  var endLf = /\n$/;
  var startCr = /^\r/;
  var crlf = /\r\n/g;
  var cr = /\r/g;

  return through(function (chunk, enc, cb) {
    var data = chunk.toString();

    // replace crlf to lf throughout the chunk
    data = data.replace(crlf, '\n');

    if (endsInLf) {
      // the previous chunk ended in lf, so if this one starts
      // in cr, we should just remove the cr (since lf was
      // already written)
      data = data.replace(startCr, '');
    }

    endsInLf = endLf.test(data);

    // change any remaining cr to lf
    data = data.replace(cr, '\n');

    cb(null, data);
  });
};
