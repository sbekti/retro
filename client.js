//var jpeg = require('jpeg-js');

var socket = io();
var canvas = document.getElementById('canvas-screen');
var context = canvas.getContext('2d');

var shifting = false;
var ctrling = false;
var alting = false;

var keymap = {
    8: 'backspace'
  , 9: 'tab'
  , 13: 'ret'
  , 16: 'shift'
  , 17: 'ctrl'
  , 18: 'alt'
  , 19: '?'// pause
  , 20: 'caps_lock'
  , 27: 'esc'
  , 32: 'spc'
  , 33: 'pgup'
  , 34: 'pgdn'
  , 35: 'end'
  , 36: 'home'
  , 37: 'left'
  , 38: 'up'
  , 39: 'right'
  , 40: 'down'
  , 44: 'print'
  , 45: 'insert'
  , 46: 'delete'
  , 48: '0'
  , 49: '1'
  , 50: '2'
  , 51: '3'
  , 52: '4'
  , 53: '5'
  , 54: '6'
  , 55: '7'
  , 56: '8'
  , 57: '9'
  , 59: 'semicolon'
  , 61: 'equal'
  , 65: 'a'
  , 66: 'b'
  , 67: 'c'
  , 68: 'd'
  , 69: 'e'
  , 70: 'f'
  , 71: 'g'
  , 72: 'h'
  , 73: 'i'
  , 74: 'j'
  , 75: 'k'
  , 76: 'l'
  , 77: 'm'
  , 78: 'n'
  , 79: 'o'
  , 80: 'p'
  , 81: 'q'
  , 82: 'r'
  , 83: 's'
  , 84: 't'
  , 85: 'u'
  , 86: 'v'
  , 87: 'w'
  , 88: 'x'
  , 89: 'y'
  , 90: 'z'
  , 91: 'ctrl' // left command
  , 93: 'ctrl' // right command
  , 107: 'equal'
  , 109: 'minus'
  , 112: 'f1'
  , 113: 'f2'
  , 114: 'f3'
  , 115: 'f4'
  , 116: 'f5'
  , 117: 'f6'
  , 118: 'f7'
  , 119: 'f8'
  , 120: 'f9'
  , 121: 'f10'
  , 122: 'f11'
  , 123: 'f12'
  , 144: 'num_lock'
  , 145: 'scroll_lock'
  , 186: 'semicolon'
  , 187: 'equal'
  , 188: 'comma'
  , 189: 'minus'
  , 190: 'dot'
  , 191: 'slash'
  , 192: 'apostrophe'
  , 219: 'bracket_left'
  , 220: 'backslash'
  , 221: 'bracket_right'
  , 222: '\''
  , 224: 'ctrl' // command in firefox
};

function qemukey(keycode) {
  var mapping = keymap[keycode];
  if (!mapping) return null;

  if (mapping == 'shift') {
    shifting = true; return null;
  } else if (mapping == 'ctrl') {
    ctrling = true; return null;
  } else if (mapping == 'alt') {
    alting = true; return null;
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

  socket.emit('pointer', payload);
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

  socket.emit('pointer', payload);
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

  socket.emit('pointer', payload);
});

$(document).keydown(function(e) {
  e.preventDefault();
  var key = qemukey(e.which);
  if (key) socket.emit('key', key);
});

$(document).keyup(function(e) {
  var keycode = e.which;
  var mapping = keymap[keycode];

  if (mapping == 'shift') {
    shifting = false;
  } else if (mapping == 'ctrl'){
    ctrling = false;
  } else if (mapping == 'alt') {
    alting = false;
  }
});

socket.on('frame', function(payload) {
  var data = payload.frame.data;
  var image = context.createImageData(payload.width, payload.height);

  for (var s = 0, d = 0, len = payload.width * payload.height * 4; d < len; ++d) {
    if (d % 4 == 3) {
      image.data[d] = 0xff;
    } else {
      image.data[d] = data[s];
      ++s;
    }
  }

  context.putImageData(image, payload.x, payload.y);
});

var x = canvas.width / 2;
var y = canvas.height / 2;

context.font = '30pt Tahoma';
context.textAlign = 'center';
context.fillStyle = 'black';
context.fillText('Loading screen...', x, y);
