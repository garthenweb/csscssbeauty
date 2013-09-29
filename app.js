var express = require('express');
var app     = express();
var swig    = require('swig');

swig.setDefaults({
	root: __dirname + '/views',
	allowErrors: false,
	// cache: 'memory'
	cache: false
});

app.engine('html.twig', swig.renderFile);
app.set('view engine', 'html.twig');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

module.exports = app;