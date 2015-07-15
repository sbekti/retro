var express = require('express');
var app = express();
var http = require('http').Server(app);
var sockjs = require('sockjs');
var path = require('path');
var rfb = require('rfb2');
var net = require('net');

var clients = {};

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var ws = sockjs.createServer();
ws.installHandlers(http, { prefix: '/ws' });

var r = rfb.createConnection({
  host: process.env.RFB_HOST || 'bekti.io',
  port: process.env.RFB_PORT || 5902,
  password: process.env.RFB_PASSWORD
});

var tcp = net.connect({
  host: process.env.RFB_HOST || 'bekti.io',
  port: process.env.RFB_MONITOR_PORT || 4444
});

function broadcast(event, data) {
  var payload = {
    event: event,
    data: data
  }

  for (var client in clients) {
    clients[client].write(JSON.stringify(payload));
  }
}

function broadcastOnlineCount() {
  var data = {
    count: Object.keys(clients).length
  };

  broadcast('count', data);
}

r.on('connect', function() {
  console.log('Remote screen name: ' + r.title + ' width:' + r.width + ' height: ' + r.height);
});

r.on('rect', function(rect) {
  if (rect.encoding != 0) return;

  var frameBuffer = new Uint8Array(rect.width * rect.height * 3);

  for (var i = 0, o = 0; i < rect.data.length; i += 4) {
    frameBuffer[o++] = rect.data[i + 2];
    frameBuffer[o++] = rect.data[i + 1];
    frameBuffer[o++] = rect.data[i];
  }

  var data = {
    frame: frameBuffer,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  }

  broadcast('frame', data);
});

ws.on('connection', function(conn) {
  clients[conn.id] = conn;
  broadcastOnlineCount();
  r.requestUpdate(false, 0, 0, r.width, r.height);

  conn.on('data', function(data) {
    var payload = JSON.parse(data)

    switch (payload.event) {
      case 'pointer':
        r.pointerEvent(payload.data.x, payload.data.y, payload.data.button);
        break;
      case 'key':
        tcp.write('sendkey ' + payload.data.key + '\n');
        break;
      default:
    }
  });

  conn.on('close', function() {
    delete clients[conn.id];
    broadcastOnlineCount();
  });
});

http.listen(5000, function() {
  console.log('listening on *:5000');
});

setInterval(function() {
  global.gc();
}, 5000);
