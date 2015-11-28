var http = require('http');
var socketio = require('socket.io');

var express = require('express');
var swig = require('swig');

/**
 * Configures an app for static assets and template engine
 */
function configure(app) {
  swig.setDefaults({
    root: __dirname + '/../views',
    allowErrors: false,
    cache: false,
  });

  app.engine('html.twig', swig.renderFile);
  app.set('view engine', 'html.twig');
  app.set('views', __dirname + '/../views');

  app.use(express.static(__dirname + '/../public'));

  return app;
}

/**
 * Creates an http and websocket server
 */
module.exports = function createServer(options) {
  var port = options.port;

  var app = express();
  var server = http.createServer(app);
  var io = socketio.listen(server);
  var sockets = io.sockets;
  configure(app);

  // start server on given port and open the browser
  server.listen(port);

  return {
    server: server,
    app: app,
    sockets: sockets,
  };
};
