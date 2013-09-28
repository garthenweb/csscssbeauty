var spawn = require('child_process').spawn;

module.exports = function(args, callback) {

	'use strict';

	if(!args) {
		args = [];
	}

	var csscss = spawn(process.platform === 'win32' ? 'csscss.bat' : 'csscss', args);

	var stdout = '';
	csscss.stdout.on('data', function (data) {
		stdout += data;
	});

	csscss.on('close', function (code) {
		callback(null, stdout);
	});

	csscss.on('error', callback);

};