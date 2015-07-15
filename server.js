var express = require('express');
var app = express();
var http = require('http').Server(app);
//var io = require('socket.io')(http);
var sockjs = require('sockjs');
var path = require('path');
var rfb = require('rfb2');
var net = require('net');

var clients = {};
//var onlineCount = 0;

var echo = sockjs.createServer();

var r = rfb.createConnection({
  host: process.env.RFB_HOST || 'bekti.io',
  port: process.env.RFB_PORT || 5902,
  password: process.env.RFB_PASSWORD
});

var tcp = net.connect({
  host: process.env.RFB_HOST || 'bekti.io',
  port: process.env.RFB_MONITOR_PORT || 4444
});

r.on('connect', function() {
  console.log('Remote screen name: ' + r.title + ' width:' + r.width + ' height: ' + r.height);
});

r.on('rect', function(rect) {
  if (rect.encoding != 0) return;

  const frameBuffer = new Uint8Array(rect.width * rect.height * 3);

  for (var i = 0, o = 0; i < rect.data.length; i += 4) {
    frameBuffer[o++] = rect.data[i + 2];
    frameBuffer[o++] = rect.data[i + 1];
    frameBuffer[o++] = rect.data[i];
  }

  const payload = {
    frame: frameBuffer,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  }

  //io.emit('frame', payload);
});

// io.on('connection', function(socket) {
//   ++onlineCount;
//   io.emit('count', onlineCount);
//   r.requestUpdate(false, 0, 0, r.width, r.height);
//
//   socket.on('pointer', function(payload) {
//     r.pointerEvent(payload.x, payload.y, payload.button);
//   });
//
//   socket.on('key', function(key) {
//     tcp.write('sendkey ' + key + '\n');
//   });
//
//   socket.on('disconnect', function(payload) {
//     --onlineCount;
//     io.emit('count', onlineCount);
//   });
// });

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

function broadcast(message) {
  for (var client in clients) {
    clients[client].write(JSON.stringify(message));
  }
}

echo.on('connection', function(conn) {
  clients[conn.id] = conn;

  conn.on('data', function(message) {
    console.log(message);
    broadcast(JSON.parse(message));
  });

  conn.on('close', function() {
    delete clients[conn.id];
  });
});

echo.installHandlers(http, {
  prefix: '/echo'
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});
