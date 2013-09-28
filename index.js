#!/usr/bin/env node

var argv    = require('optimist').argv;
var watch   = require('node-watch');
var http    = require('http');
var csscss  = require('./csscss');
var app     = require('./app');

var server  = http.createServer(app);
var sockets = require('./socket')(server);

// object store
var store = {};

// wrapper for csscss generator
function runCSSCSS() {
	csscss(['--json'].concat(argv._), updateData);
}

// update the data
function updateData(err, data) {
	if(err) {
		throw err;
	}
	store.data = JSON.parse(data);
	sockets.emit('update', {trigger: true});
}

// set file watcher
watch(argv._, runCSSCSS);

// initial generate data
runCSSCSS();

// routing
app.get('/', function(req, res) {
	res.render('index', store);
});

// start server on given port
server.listen(process.env.PORT || argv.port || 8787);
console.log("Open http://localhost:%d in your browser", server.address().port);