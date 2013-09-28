#!/usr/bin/env node

var argv    = require('optimist')
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

// wrapper for csscss generator
function runCSSCSS() {
	var args = (argv._)
		.concat(require('./csscss-args')(argv))
		.concat(['--json']);

	csscss(args, updateData);
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

// console.log(argv);

// start server on given port and open the browser
server.listen(process.env.PORT || argv.port);
if(argv.browser === 'false') {
	console.log('Connect to http://localhost:' + server.address().port + ' to see the result');
} else {
	open('http://localhost:' + server.address().port, argv.browser);
}