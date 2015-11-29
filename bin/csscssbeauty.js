#!/usr/bin/env node

var watch = require('node-watch');
var open = require('open');
var glob = require('glob');
/**
 * Parsed list of arguments
 */
var argv = require('minimist')(process.argv.slice(2), {
  boolean: true,
  default: {
    port: process.env.PORT || '8787',
    browser: true,
  },
  alias: {
    'v': 'verbose',
    'n': 'num',
  },
});

var createServer = require('../lib/createServer');
var csscss = require('../lib/csscss');
var logger = require('../lib/logger');

/**
 * Read all files from patterns.
 * Async/ parallel execution would be better for performance but would require
 * complex logic, additional dependencies or a higher node version. This is just
 * executed once on start so its okay to execute in sync.
 */
var files = argv._
  .map(function patternToFiles(pattern) {
    return glob.sync(pattern);
  })
  .reduce(function mergeFiles(totalFiles, addFiles) {
    return totalFiles.concat(addFiles);
  }, []);

var servers = createServer({ port: argv.port });
var url = ('http://localhost:' + argv.port);
/**
 * Initialize a route to show results for all duplicate rules
 */
servers.app.get('/', function handleIndex(req, res) {
  csscss.execute(files, argv, function renderIndex(err, csscssData) {
    if (err) {
      throw err;
    }
    res.render('index', { data: csscssData });
  });
});

/**
 * watch all files for changes and emit an update event
 */
watch(files, function onChange(file) {
  logger('csscssbeauty: File `' + file + '` changed.');
  // send reload event
  servers.sockets.emit('update', { trigger: true });
});

/**
 * Open a browser tab if defined in arguments
 */
if (argv.browser && argv.browser !== 'false') {
  open(
    url,
    // don't pass boolean, but browser string if defined
    typeof argv.browser === 'boolean' ? null : argv.browser
  );
}

/**
 * Finally show some logs
 */
logger('csscssbeauty: Server started. Open `' + url + '` to see the results.');
if (files.length === 0) {
  logger('csscssbeauty: No files found.');
  process.exit();
}

logger('csscssbeauty: Listen for files');
files.forEach(function showFiles(file) {
  logger('  ' + file);
});
