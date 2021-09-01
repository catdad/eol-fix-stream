/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var es = require('event-stream');

var mod = require('../');

describe('[index]', function () {
  it('replaces crlf with lf', function (done) {
    es.readArray([
      'chunk\r\nwith\r\nline\r\nendings'
    ]).pipe(mod()).pipe(es.wait(function (err, data) {
      data = data.toString();

      expect(data).to.not.match(/\r\n/g);
      expect(data).to.equal('chunk\nwith\nline\nendings');

      done();
    }));
  });

  it('handles when a chunk breaks right on the crlf', function (done) {
    es.readArray([
      'chunk\r', '\nwith\r', '\nline\r', '\nendings'
    ]).pipe(mod()).pipe(es.wait(function (err, data) {
      data = data.toString();

      expect(data).to.not.match(/\r\n/g);
      expect(data).to.equal('chunk\nwith\nline\nendings');

      done();
    }));
  });

  it('handles weird lncr business output by Windows CLIs', function (done) {
    es.readArray([
      'chunk\n', '\rwith\n', '\rline\n', '\rendings'
    ]).pipe(mod()).pipe(es.wait(function (err, data) {
      data = data.toString();

      expect(data).to.not.match(/\r\n/g);
      expect(data).to.equal('chunk\nwith\nline\nendings');

      done();
    }));
  });

  it('handles mixed cases', function (done) {
    es.readArray([
      'chunk\r\nwith\n\rline\r', '\nendings'
    ]).pipe(mod()).pipe(es.wait(function (err, data) {
      data = data.toString();

      expect(data).to.not.match(/\r\n/g);
      expect(data).to.equal('chunk\nwith\nline\nendings');

      done();
    }));
  });

  it('replaces stray cr with lf', function (done) {
    es.readArray([
      'chunk\r\nwith\rline\r\nendings'
    ]).pipe(mod()).pipe(es.wait(function (err, data) {
      data = data.toString();

      expect(data).to.not.match(/\r\n/g);
      expect(data).to.equal('chunk\nwith\nline\nendings');

      done();
    }));
  });

  describe('defining a custom `eol` value', function () {
    it('accepts \\r\\n as a custom line ending', function (done) {
      es.readArray([
        'chunk\nchunk\rchunk\r\nchunk\r', '\nchunk', '\n',
      ]).pipe(mod('\r\n')).pipe(es.wait(function (err, data) {
        data = data.toString();

        expect(data).to.equal('chunk\r\nchunk\r\nchunk\r\nchunk\r\nchunk\r\n');

        done();
      }));
    });

    it('accepts \\r as a custom line ending', function (done) {
      es.readArray([
        'chunk\nchunk\rchunk\r\nchunk\r', '\nchunk', '\n',
      ]).pipe(mod('\r')).pipe(es.wait(function (err, data) {
        data = data.toString();

        expect(data).to.equal('chunk\rchunk\rchunk\rchunk\rchunk\r');

        done();
      }));
    });

    it('accepts \\n as a custom line ending', function (done) {
      es.readArray([
        'chunk\nchunk\rchunk\r\nchunk\r', '\nchunk', '\n',
      ]).pipe(mod('\n')).pipe(es.wait(function (err, data) {
        data = data.toString();

        expect(data).to.equal('chunk\nchunk\nchunk\nchunk\nchunk\n');

        done();
      }));
    });

    it('throws if an unknown custom line ending is used', function () {
      expect(function () {
        mod('wat');
      }).to.throw(Error, 'Invalid EOL: "wat"');
    });
  });
});
