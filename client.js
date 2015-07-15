var socket = new SockJS('/ws');
var keymap = require('./keymap');
var canvas = document.getElementById('canvas-screen');
var context = canvas.getContext('2d');

var shifting = false;
var ctrling = false;
var alting = false;

function send(event, data) {
  var payload = {
    event: event,
    data: data
  };

  socket.send(JSON.stringify(payload));
}

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

  var data = {
    x: x,
    y: y,
    button: button
  };

  send('pointer', data);
});

$('#canvas-screen').mouseup(function(e) {
  e.preventDefault();
  var offset = $(this).offset();
  var x = (e.pageX - offset.left).toFixed(0);
  var y = (e.pageY - offset.top).toFixed(0);

  var data = {
    x: x,
    y: y,
    button: 0
  };

  send('pointer', data);
});

$('#canvas-screen').mousemove(function(e) {
  e.preventDefault();
  var offset = $(this).offset();
  var x = (e.pageX - offset.left).toFixed(0);
  var y = (e.pageY - offset.top).toFixed(0);
  var button = e.which;
  if (button == 3) button = 4;

  var data = {
    x: x,
    y: y,
    button: button
  };

  send('pointer', data);
});

$(document).keydown(function(e) {
  e.preventDefault();
  var key = qemukey(e.which);
  if (key) send('key', key);
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

function handleFrameUpdate(data) {
  var frame = data.frame;
  var image = context.createImageData(data.width, data.height);

  for (var s = 0, d = 0, len = data.width * data.height * 4; d < len; ++d) {
    if (d % 4 == 3) {
      image.data[d] = 0xff;
    } else {
      image.data[d] = frame[s];
      ++s;
    }
  }

  context.putImageData(image, data.x, data.y);
}

socket.onmessage = function(e) {
  var payload = JSON.parse(e.data);

  switch (payload.event) {
    case 'count':
      $('#online-count').text(payload.data.count);
      break;
    case 'frame':
        handleFrameUpdate(payload.data);
      break;
    default:
  }
};

var x = canvas.width / 2;
var y = canvas.height / 2;

context.font = '30pt Tahoma';
context.textAlign = 'center';
context.fillStyle = 'black';
context.fillText('Loading screen...', x, y);
