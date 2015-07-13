var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var jpeg = require('jpeg-js');
var rfb = require('rfb2');

var limit = false;

var r = rfb.createConnection({
  host: 'bekti.io',
  port: 5902,
  password: ''
});

r.on('connect', function() {
  console.log('Successfully connected and authorised');
  console.log('Remote screen name: ' + r.title + ' width:' + r.width + ' height: ' + r.height);
});

r.on('rect', function(rect) {
  if (limit) return;

  if (rect.encoding != 0) {
    console.log('COPY');
    return;
  }

  console.log('RAW')

  var frame = new Buffer(rect.width * rect.height * 4);

  for (var i = 0, o = 0; i < rect.data.length; i += 4) {
    frame[o++] = rect.data[i + 2];
    frame[o++] = rect.data[i + 1];
    frame[o++] = rect.data[i];
    frame[o++] = 0xff;
  }

  var rawImage = {
    data: frame,
    width: rect.width,
    height: rect.height
  };

  var jpegImage = jpeg.encode(rawImage, 50);
  var payload = {
    data: jpegImage.data.toString('base64'),
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  }

  io.emit('frame', payload);
  limit = true;

  setTimeout(function() {
    limit = false;
  }, 1000);
});

io.on('connection', function(socket) {
  r.requestUpdate(false, 0, 0, r.width, r.height);
  console.log('a user connected');
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});
