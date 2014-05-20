var test = require('tape');
var StreamWrap = require('./index');
var through2 = require('through2');
var JSONStream = require('JSONStream');
test('Should be able to create a transform stream', function (t) {
    t.plan(1);
    var wrappedStream = StreamWrap({
        result: 'Success',
        response: {
            rows: '{{__target__}}'
        },
        otherdata: {
            somedata: {}
        }
    });

    var writeStream = JSONStream.stringify('[',',',']');
    writeStream
        .pipe(wrappedStream)

    var output = '';
    wrappedStream.on('data', function (buffer) {
        output += buffer.toString('ascii');
    })
    wrappedStream.on('end', function () {
        JSON.parse(output);
        t.equal(1,1);
        t.end();
    })



    var array = [];
    for (var i = 0; i < 300; i += 1) {
        writeStream.write({value:'The rabbit jumped ' + i + ' times.'});
    }
    writeStream.end();
    
});