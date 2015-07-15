var forever = require('forever-monitor');

var child = new(forever.Monitor)('server.js', {
  'command': 'node --expose-gc',
  'minUptime': 1000,
  'spinSleepTime': 5000
});

child.on('exit', function() {
  console.log('Server crashed. Restarting...');
});

child.start();
