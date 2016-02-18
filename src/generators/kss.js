var fs         = require('fs');
var kss        = require('kss');
var path       = require('path');
var handlebars = require('handlebars');
var beautify   = require('js-beautify').html;

var KssGenerator = function(kraftverk) {
	this.kraftverk = kraftverk;
	this.options   = kraftverk.options;
};

KssGenerator.prototype = {

	options : {},

	/**
	 * Styleguide Methods
	 */

	parseSection : function(section) {
		var data = {
			title        : section.data.header,
			numeric      : section.data.autoincrement,
			description  : section.data.description,
			reference    : section.data.reference,
			topReference : section.data.reference.split('.')[0],
			markup       : section.data.markup,
			hasDemo      : !!section.data.markup,
			modifiers    : {
				modifier : section.data.modifiers.map(function(modifier) {
					var value = modifier.className();

					return {
						value       : value,
						reference   : section.data.reference + '.modifier.' + value,
						description : modifier.data.description
					}
				})
			},
			custom : {}
		};

		if (this.options.kss.custom) {
			for (var i in this.options.kss.custom) {
				custom = this.options.kss.custom[i].toLowerCase();

				data.custom[custom] = section.data[custom];
			}
		}

		if (data.markup && data.markup.match(/^[^\n]+\.hbs$/)) {
			var file = path.join(this.options.src, data.markup);

			if (fs.existsSync(file)) {
				data.markup = fs.readFileSync(file, 'utf8');
			} else {
				data.markup = 'NOT FOUND';
			}

			file = file.replace('.hbs', '.json');

			if (fs.existsSync(file)) {
				data.props = JSON.parse(fs.readFileSync(file, 'utf8'));
			}

			handlebars.registerPartial(data.reference, data.markup);
		}

		return data;
	},

	getStyleguide : function(source) {
		var options = this.options;

		return new Promise(function(resolve, reject) {
			kss.traverse(source, options, function(err, styleguide) {
				resolve(styleguide.section().map(this.parseSection.bind(this)));
			}.bind(this));
		}.bind(this));
	},

	/**
	 * Demo Methods
	 */

	generateDemos : function(section, data, partial) {
		data.content = this.compile(`{{> ${section.reference}}}`, section.props);

		this.kraftverk.putFile(
			this.kraftverk.getPath(path.join(section.reference, 'index')),
			partial(data)
		);

		if (section.modifiers.modifier.length) {
			var mod, file;

			for (i = 0, l = section.modifiers.modifier.length; i < l; i++) {
				mod  = section.modifiers.modifier[i];
				file = this.kraftverk.getPath(path.join(section.reference, 'modifier', mod.value));

				data.content = this.compile(`{{> ${section.reference} modifier="${mod.value}"}}`, section.props);

				this.kraftverk.putFile(file, partial(data));
			}
		}
	},

	/**
	 * Handlebars Methods
	 */

	compile : function(partial, data) {
		return beautify(handlebars.compile(partial)(data), {
			max_preserve_newlines : 0
		});
	}

};

module.exports = function(kraftverk) {
	return new KssGenerator(kraftverk);
};
