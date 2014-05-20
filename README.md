This module is for Wrapping streams.

Lets say this simple usecase

```javascript
LevelDB.createReadStream().pipe(JSONStream.stringify()).pipe(res);
```
would result in

```javascript
[
  {},
  {},
  {},
]
```
but what if you wanted
```javascript
{
    rows: [
       {},
       {},
       {},
    ]
}

// You would have to

res.write("{rows:");
var stream = LevelDB.createReadStream().pipe(JSONStream.stringify());
stream.on('end', function() {
    res.write("}");
    res.end();
})

// That isnt very streamy. 

```

So, in comes stream-wrap

```javascript
var wrappedStream = require('stream-wrap')({
    result: 'success',
    rows: '{{__target__}}'
})

LevelDB.createReadStream().pipe(JSONStream.stringify()).pipe(wrappedStream).pipe(res);

```

I havent actually tested any of the aforementioned code, but here is the test as an example

```javascript

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

```