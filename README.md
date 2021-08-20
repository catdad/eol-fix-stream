# eol fix stream

[![Build][1]][2]
[![Coverage][3]][4]
[![Maintainability][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[1]: https://img.shields.io/github/workflow/status/catdad/eol-fix-stream/CI?label=CI&logo=github
[2]: https://github.com/catdad/eol-fix-stream/actions/workflows/ci.yml

[3]: https://img.shields.io/codeclimate/coverage/catdad/eol-fix-stream
[4]: https://codeclimate.com/github/catdad/eol-fix-stream/coverage

[5]: https://img.shields.io/codeclimate/maintainability/catdad/eol-fix-stream
[6]: https://codeclimate.com/github/catdad/eol-fix-stream

[7]: https://img.shields.io/npm/dm/eol-fix-stream.svg
[8]: https://www.npmjs.com/package/eol-fix-stream
[9]: https://img.shields.io/npm/v/eol-fix-stream.svg

[10]: https://david-dm.org/catdad/eol-fix-stream.svg
[11]: https://david-dm.org/catdad/eol-fix-stream

End all the things with `lf`.

## Install

```bash
npm install --save eol-fix-stream
```

## Use

```javascript
var eolFix = require('eol-fix-stream');

var input = getInputStreamSomehow();
var output = getOutputStreamSomehow();

input.pipe(eolFix()).pipe(output);
```

For example, you can create a CLI module that reads standard input, fixes line endings, and writes to standard output in just two lines:

```javascript
var eolFix = require('eol-fix-stream');

process.stdin.pipe(eolFix()).pipe(process.stdout);
```
