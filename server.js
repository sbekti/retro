var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var jpeg = require('jpeg-js');
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
  
  var frame = new Buffer(rect.width * rect.height * 4);

  for (var i = 0, o = 0; i < rect.data.length; i += 4) {
    frame[o++] = rect.data[i];
    frame[o++] = rect.data[i + 1];
    frame[o++] = rect.data[i + 2];
    frame[o++] = 0xff;
  }

  var data = frame.toJSON(frame);

  var payload = {
    data: data,
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
