var through2 = require('through2');

var StreamWrap = function StreamWrap (wrapper, opts) {
    if (!('string' === typeof wrapper)) {
        wrapper = JSON.stringify(wrapper);
    }
    var wrappers = wrapper.split('"{{__target__}}"');
    var opts = opts || {};

    var transform = function (chunk, enc, cb) {
        this.push(chunk);
        cb();
    }

    var flush = function (cb) {
        this.push(new Buffer(wrappers[1]));
        cb();
    }

    var stream = through2(opts, transform, flush);

    stream.write(wrappers[0]);

    return stream;
}

module.exports = StreamWrap;