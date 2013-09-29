#!/usr/bin/env node

var argv = require('optimist')
	.boolean('v')
	.boolean('verbose')
	.boolean('color')
	.boolean('match-shorthand')
	.boolean('ignore-sass-mixins')
	.boolean('compass')
	.default('port', 8787)
	.argv;
var watch   = require('node-watch');
var open    = require('open');
var http    = require('http');
var csscss  = require('./csscss');
var app     = require('./app');

var server  = http.createServer(app);
var sockets = require('./socket')(server);

// object store
var store = {};

// update the data
var updateData = (function () {

	var timesReloaded = 0;

	return function(err, data) {
		if(err) {
			throw err;
		}

		store.data = data ? JSON.parse(data) : [];
		sockets.emit('update', {trigger: true});

		if(timesReloaded === 0) {
			// open browser or notify the user to open the browser
			if(argv.browser === 'false') {
				console.log('Connect to http://localhost:' + server.address().port + ' to see the result');
			} else {
				open('http://localhost:' + server.address().port, argv.browser);
			}
		}

		timesReloaded++;

	};

})();

// wrapper for csscss generator
var runCSSCSS = (function() {

	var args = (argv._)
		.concat(require('./csscss-args')(argv))
		.concat(['--json']);

	return function() {
		csscss(args, updateData);
	};

})();

// routing
app.get('/', function(req, res) {
	res.render('index', store);
});

// start server on given port and open the browser
server.listen(process.env.PORT || argv.port);

// initial generate data
runCSSCSS();
// activate file watcher
watch(argv._, runCSSCSS);