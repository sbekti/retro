var forever = require('forever-monitor');

var child = new(forever.Monitor)('server.js', {
  'spinSleepTime': 1000
});

child.on('exit', function() {
  console.log('Server crashed. Restarting...');
});

child.start();
