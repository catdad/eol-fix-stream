/* jshint node: true */

var through = require('through2');

module.exports = function lfcrClean() {
  var endsInLf = false;
  var endsInCr = false;

  var endLf = /\n$/;
  var endCr = /\r$/;
  var startLf = /^\n/;
  var startCr = /^\r/;
  var crlf = /\r\n/g;
  var cr = /\r/g;

  // because Windows CLIs :(
  var lfcr = /\n\r/g;

  return through(function (chunk, enc, cb) {
    var data = chunk.toString();

    // replace crlf to lf throughout the chunk
    data = data.replace(crlf, '\n').replace(lfcr, '\n');

    if (endsInLf) {
      // the previous chunk ended in lf, so if this one starts
      // in cr, we should just remove the cr (since lf was
      // already written)
      data = data.replace(startCr, '');
    }

    if (endsInCr) {
      // we would have already replaced that cr with lf,
      // so just remove the first lf at the start of the
      // stringfrom this chunk
      data = data.replace(startLf, '');
    }

    endsInLf = endLf.test(data);
    endsInCr = endCr.test(data);

    // change any remaining cr to lf
    data = data.replace(cr, '\n');

    cb(null, data);
  });
};
