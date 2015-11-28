#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['verbose', 'color', 'match-shorthand', 'ignore-sass-mixins', 'compass'],
  default: {
    port: process.env.PORT || '8787',
    browser: true,
  },
  alias: {
    'v': 'verbose',
    'n': 'num',
  },
});
var watch = require('node-watch');
var open = require('open');

var createServer = require('../lib/createServer');
var csscss = require('../lib/csscss');

var servers = createServer({ port: argv.port });
var url = ('http://localhost:' + argv.port);
servers.app.get('/', function handleIndex(req, res) {
  csscss.execute(argv._, argv, function renderIndex(err, csscssData) {
    if (err) {
      throw err;
    }
    res.render('index', { data: csscssData });
  });
});

// activate file watcher
watch(argv._, function onChange() {
  // send reload event
  servers.sockets.emit('update', { trigger: true });
});

console.log('Open `' + url + '` to see the result');
if (argv.browser) {
  open(
    url,
    // don't pass boolean, but browser string if defined
    typeof argv.browser === 'boolean' ? null : argv.browser
  );
}
