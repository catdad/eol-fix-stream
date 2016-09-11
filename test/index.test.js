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
});
