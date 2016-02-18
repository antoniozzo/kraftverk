var fs       = require('fs');
var path     = require('path');
var findup   = require('findup');
var extend   = require('extend');
var minimist = require('minimist');

var CONFIG_FILENAME = 'kraftverk.config.js';
var DEFAULT_CONFIG  = {
	port      : 8080,
	generator : 'kss',
	src       : 'src',
	public    : 'dist',
	dist      : 'styleguide',
	title     : 'Style Guide',
	styles    : [],
	scripts   : [],

	theme : {
		name   : 'default',
		logo   : '/assets/logo.svg',
		sprite : ''
	},

	kss : {
		depth  : 2,
		custom : ['Template', 'Component', 'Transparent', 'IframeHeight'],
		watch  : '**/*.{hbs,css,less,scss}'
	},

	react : {
		demo  : '.demo.js',
		watch : '**/*.{js}'
	},

	docs : {
		title : 'Documentation',
		dir   : 'src/docs',
		index : 'index.md',
	},

	webpack : {
		//
	},

	sections : [
		//
	]
};

function findConfig(argv) {
	if (argv.config) {
		var configFilepath = path.join(process.cwd(), argv.config);

		if (!fs.existsSync(configFilepath)) {
			throw Error('Kraftverk config not found: ' + configFilepath + '.');
		}

		return configFilepath;
	} else {
		try {
			var configDir = findup.sync(process.cwd(), CONFIG_FILENAME);
		} catch (e) {
			throw Error('Kraftverk config not found: ' + CONFIG_FILENAME + '.');
		}

		return path.join(configDir, CONFIG_FILENAME);
	}
}

module.exports = function() {
	var argv    = minimist(process.argv.slice(2));
	var options = require(findConfig(argv));

	return extend(true, {}, DEFAULT_CONFIG, options);
};
