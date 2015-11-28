var spawn = require('child_process').spawn;

function normalizeArguments(argv) {
  var blacklist = ['browser', 'port', '_'];
  var args = Object.keys(argv)
    .map(function getPairs(key) {
      if (blacklist.indexOf(key) !== -1) {
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

function executeCSSCSS(files, options, cb) {
  var stdout = '';
  var args = files.concat(normalizeArguments(options));
  var programm = process.platform === 'win32' ? 'csscss.bat' : 'csscss';
  // allways require json format
  args.push('--json');

  return spawn(programm, args)
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