var fs         = require('fs');
var ncp        = require('ncp');
var path       = require('path');
var read       = require('fs-readdir-recursive');
var handlebars = require('handlebars');

var Theme = function(kraftverk) {
	this.kraftverk = kraftverk;
	this.options   = kraftverk.options;
	this.template  = handlebars.compile(this.getFile('index'));

	handlebars.registerHelper(this.getHelpers());
	handlebars.registerPartial(this.getPartials());
};

Theme.prototype = {

	/**
	 * Callbacks from Kraftverk
	 */

	prepare : function() {
		var assets = {};
		var dir    = path.join(__dirname, 'assets');
		var files  = read(dir);

		files.forEach(function(filename) {
			var file = path.join('assets', filename);

			fs.readFile(path.join(dir, filename), function(err, data) {
				this.kraftverk.putFile(file, data);
			}.bind(this));
		}.bind(this));
	},

	/**
	 * Private methods
	 */

	getFile : function(file) {
		return fs.readFileSync(path.join(__dirname, file + '.hbs'), 'utf8');
	},

	getHelpers : function() {
		return require(path.join(__dirname, 'helpers'))(this.kraftverk);
	},

	getPartials : function() {
		var partials = {};
		var dir      = path.join(__dirname, 'partials');
		var files    = read(dir);

		files.forEach(function(filename) {
			var matches = /^([^.]+).hbs$/.exec(filename);

			if (!matches) return;

			var name = 'partial.' + matches[1];

			partials[name] = fs.readFileSync(dir + '/' + filename, 'utf8');
		});

		return partials;
	}
};

module.exports = function(kraftverk) {
	return new Theme(kraftverk);
};
