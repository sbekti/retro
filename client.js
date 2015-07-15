var socket = new SockJS('/echo');
//var socket = io();
var keymap = require('./keymap');
var canvas = document.getElementById('canvas-screen');
var context = canvas.getContext('2d');

var shifting = false;
var ctrling = false;
var alting = false;

function qemukey(keycode) {
  var mapping = keymap[keycode];
  if (!mapping) return null;

  if (mapping == 'shift') {
    shifting = true;
    return null;
  } else if (mapping == 'ctrl') {
    ctrling = true;
    return null;
  } else if (mapping == 'alt') {
    alting = true;
    return null;
  }

  var prefix = '';
  if (shifting) prefix += 'shift-';
  if (ctrling) prefix += 'ctrl-';
  if (alting) prefix += 'alt-';

  return prefix + mapping;
}

$('#canvas-screen').mousedown(function(e) {
  e.preventDefault();
  var offset = $(this).offset();
  var x = (e.pageX - offset.left).toFixed(0);
  var y = (e.pageY - offset.top).toFixed(0);
  var button = e.which;
  if (button == 3) button = 4;

  var payload = {
    x: x,
    y: y,
    button: button
  };

  //socket.emit('pointer', payload);
});

$('#canvas-screen').mouseup(function(e) {
  e.preventDefault();
  var offset = $(this).offset();
  var x = (e.pageX - offset.left).toFixed(0);
  var y = (e.pageY - offset.top).toFixed(0);

  var payload = {
    x: x,
    y: y,
    button: 0
  };

  //socket.emit('pointer', payload);
});

$('#canvas-screen').mousemove(function(e) {
  e.preventDefault();
  var offset = $(this).offset();
  var x = (e.pageX - offset.left).toFixed(0);
  var y = (e.pageY - offset.top).toFixed(0);
  var button = e.which;
  if (button == 3) button = 4;

  var payload = {
    x: x,
    y: y,
    button: button
  };

  //socket.emit('pointer', payload);
});

$(document).keydown(function(e) {
  e.preventDefault();
  var key = qemukey(e.which);
  //if (key) socket.emit('key', key);
});

$(document).keyup(function(e) {
  var keycode = e.which;
  var mapping = keymap[keycode];

  if (mapping == 'shift') {
    shifting = false;
  } else if (mapping == 'ctrl') {
    ctrling = false;
  } else if (mapping == 'alt') {
    alting = false;
  }
});

// socket.on('frame', function(payload) {
//   var data = payload.frame;
//   var image = context.createImageData(payload.width, payload.height);
//
//   for (var s = 0, d = 0, len = payload.width * payload.height * 4; d < len; ++d) {
//     if (d % 4 == 3) {
//       image.data[d] = 0xff;
//     } else {
//       image.data[d] = data[s];
//       ++s;
//     }
//   }
//
//   context.putImageData(image, payload.x, payload.y);
// });

// socket.on('count', function(count) {
//   $('#online-count').text(count);
// });


socket.onopen = function() {
  console.log('open');

  var send = {
    message: 'Hi!',
    username: 'sbekti'
  };

  socket.send(JSON.stringify(send));
};

socket.onclose = function() {
  console.log('close');
};

socket.onmessage = function(e) {
  var content = JSON.parse(e.data);
  console.log(content);
};

var x = canvas.width / 2;
var y = canvas.height / 2;

context.font = '30pt Tahoma';
context.textAlign = 'center';
context.fillStyle = 'black';
context.fillText('Loading screen...', x, y);
