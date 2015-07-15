var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var rfb = require('rfb2');
var net = require('net');

var r = rfb.createConnection({
  host: 'bekti.io',
  port: 5902,
  //host: '192.168.2.27',
  //port: 5900,
  password: ''
});

var tcp = net.connect({host: 'bekti.io', port: 4444});

r.on('connect', function() {
  console.log('Remote screen name: ' + r.title + ' width:' + r.width + ' height: ' + r.height);
});

r.on('rect', function(rect) {
  if (rect.encoding != 0) return;

  var frameBuffer = new Buffer(rect.width * rect.height * 3);

  for (var i = 0, o = 0; i < rect.data.length; i += 4) {
    frameBuffer[o++] = rect.data[i + 2];
    frameBuffer[o++] = rect.data[i + 1];
    frameBuffer[o++] = rect.data[i];
  }

  var frame = frameBuffer.toJSON(frameBuffer);

  var payload = {
    frame: frame,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  }

  io.emit('frame', payload);
});

io.on('connection', function(socket) {
  r.requestUpdate(false, 0, 0, r.width, r.height);

  socket.on('pointer', function(payload) {
    r.pointerEvent(payload.x, payload.y, payload.button);
  });

  socket.on('key', function(key) {
    tcp.write('sendkey ' + key + '\n');
  });
});

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});
