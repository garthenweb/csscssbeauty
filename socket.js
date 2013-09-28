var socketio = require('socket.io');

module.exports = function(server) {

	var io = socketio.listen(server);

	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
	io.set('log level', 0);

	return io.sockets;

};