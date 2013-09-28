var mapping = {
	n: 'num',
	v: 'verbose'
};

module.exports = function(argv) {

	return Object.keys(argv).map(function(key) {

		var arg = '--';

		if(key === 'browser' || key === 'port' || key === '_' || key === '$0' ) {
			return false;
		}

		arg += mapping[key] || key;

		if(typeof(argv[key]) !== 'boolean') {

			// add value
			arg += '=' + argv[key];

		} else if(!argv[key]) {
			// remove falsy boolean values
			return false;
		}

		return arg;

	}).filter(function(key) {
		return key;
	});

};