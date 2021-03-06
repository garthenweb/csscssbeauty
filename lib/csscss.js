var spawn = require('child_process').spawn;
var argumentBlacklist = [
  // minimist non argument values
  '_',
  // only csscssbeauty arguments
  'browser',
  'port',
  // shortcuts that should be passed twice
  'n',
  'v',
  // we will always use json format, user should not override it
  'j',
  'json',
  // not supported arguments
  'show-parser-errors',
  'version',
  'V',
  'h',
  'help',
];

/**
 * Normalizes arguments for csscss. It will for examle remove backlisted
 * arguments.
 */
function normalizeArguments(argv) {
  var args = Object.keys(argv)
    .map(function getPairs(key) {
      if (argumentBlacklist.indexOf(key) !== -1) {
        return [key, null];
      }
      return [key, argv[key]];
    })
    .filter(function filterFalsy(pair) {
      return pair[1];
    })
    .map(function toArgument(pair) {
      if (typeof pair[1] === 'boolean') {
        return '--' + pair[0];
      }
      return '--' + pair[0] + '=' + pair[1];
    });

  return args;
}

/**
 * Executes csscss and returns the result as json.
 */
function executeCSSCSS(files, options, cb) {
  var stdout = '';
  var args = files.concat(normalizeArguments(options));
  var programm = process.platform === 'win32' ? 'csscss.bat' : 'csscss';
  // allways require json format
  args.push('--json');

  if (!files || files.length === 0) {
    cb(null, []);
    return;
  }

  spawn(programm, args)
    .stdout.on('data', function onData(data) {
      stdout += data;
    })
    .on('close', function onClose() {
      cb(null, stdout ? JSON.parse(stdout) : []);
    })
    .on('error', cb);
}

module.exports = {
  execute: executeCSSCSS,
};
