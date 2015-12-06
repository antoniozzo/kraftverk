var Kraftverk = function(options) {
	this.setOptions(options);

	this.registerPartials(this.getTemplatePartials());
	this.registerHelpers(this.getTemplateHelpers());

	this.assets   = this.getTemplateAssets();
	this.template = this.handlebars.compile(this.getTemplateFile('index'));
	this.example  = this.handlebars.compile(this.getTemplateFile('example'));
};

Kraftverk.prototype = {

	/**
	 * Properties
	 */

	fs         : require('fs'),
	read       : require('fs-readdir-recursive'),
	kss        : require('kss'),
	handlebars : require('handlebars'),

	styleguide : null,
	template   : null,
	pages      : {},

	options : {
		title            : 'Styleguide',
		home             : 'home.md',
		styles           : [],
		scripts          : [],
		custom           : ['Template'],
		templates        : 'src/templates',
		docs             : 'src/docs',

		template         : __dirname + '/template',
		templateAssets   : 'assets',
		templatePartials : 'partials',
		templateHelpers  : 'helpers.js',

		fileDepth        : 2,
	},

	/**
	 * Setters
	 */

	setOptions : function(options) {
		if (options) {
			for (var i in options) {
				this.options[i] = options[i];
			}
		}

		return this;
	},

	setStyleguide : function(styleguide) {
		this.styleguide = styleguide;

		return this;
	},

	/**
	 * Getters
	 */

	getTemplateFile : function(path) {
		return this.fs.readFileSync(this.options.template + '/' + path + '.hbs', 'utf8');
	},

	getTemplateAssets : function() {
		var assets      = {};
		var assetsDir   = this.options.template + '/' + this.options.templateAssets;
		var assetsFiles = this.read(assetsDir);

		assetsFiles.forEach(function(filename) {
			var name = this.options.templateAssets + '/' + filename;
			assets[name] = this.fs.readFileSync(assetsDir + '/' + filename);
		}.bind(this));

		return assets;
	},

	getTemplatePartials : function() {
		var partials      = {};
		var partialsDir   = this.options.template + '/' + this.options.templatePartials;
		var partialsFiles = this.read(partialsDir);

		partialsFiles.forEach(function(filename) {
			var matches = /^([^.]+).hbs$/.exec(filename);

			if (!matches) return;

			var name = 'partial.' + matches[1];
			partials[name] = this.fs.readFileSync(partialsDir + '/' + filename, 'utf8');
		}.bind(this));

		return partials;
	},

	getTemplateHelpers : function() {
		return require(this.options.template + '/' + this.options.templateHelpers)(this);
	},

	getStyleguideSections : function(query) {
		return this.styleguide.section(query);
	},

	getPath : function(reference) {
		return reference.replace(/\./g, '/') + '.html';
	},

	getMarkup : function(section) {
		var markup = section.markup();

		if (markup.match(/^[^\n]+\.(html|hbs)$/)) {
			var file = this.options.templates + '/' + markup;

			if (this.fs.existsSync(file)) {
				markup = this.fs.readFileSync(file, 'utf8');
			} else {
				markup = 'NOT FOUND';
			}
		}

		return markup;
	},

	getSectionPartials : function(sections) {
		var partials = {};
		var file, name, markup;

		for (var i = 0, l = sections.length; i < l; i++) {
			if (sections[i].markup()) {
				name = sections[i].reference();

				sections[i].data.markup = this.getMarkup(sections[i]);
				partials[name] = sections[i].data.markup;
			}
		}

		return partials;
	},

	getSectionData : function(section) {
		var data = section.toJSON();

		data.numeric      = section.data.autoincrement;
		data.topReference = section.data.reference.split('.')[0];

		var custom;
		for (var i in this.options.custom) {
			custom = this.options.custom[i].toLowerCase();

			data[custom] = section.data[custom];
		}

		return data;
	},

	/**
	 * Register Handlebars stuff
	 */

	registerHelpers : function(helpers) {
		this.handlebars.registerHelper(helpers);

		return this;
	},

	registerPartials : function(partials) {
		this.handlebars.registerPartial(partials);

		return this;
	},

	/**
	 * Generators
	 */

	generatePages : function(sections) {
		if (!sections.length) return {};

		var pages = {};
		var page, partial;

		for (var i = 0, l = sections.length; i < l; i++) {
			var file = this.getPath(sections[i].reference());

			pages[file] = this.getSectionData(sections[i]);
			pages[file].children = this.generatePages(this.getStyleguideSections(sections[i].reference() + '.x'));
		}

		return pages;
	},

	generateExamples : function(sections) {
		var examples = {};
		var section, modifier, name, partial, i1, l1, i2, l2;

		for (i1 = 0, l1 = sections.length; i1 < l1; i1++) {
			section = sections[i1];

			if (section.markup()) {
				name     = this.getPath(section.reference() + '/index');
				partial  = '{{> ' + section.reference() + '}}';

				examples[name] = this.handlebars.compile(partial);
			}

			if (section.data.modifiers) {
				for (i2 = 0, l2 = section.data.modifiers.length; i2 < l2; i2++) {
					modifier = section.data.modifiers[i2];
					name     = this.getPath(section.reference() + '/' + modifier.className());
					partial  = '{{> ' + section.reference() + ' modifier_class="' + modifier.className() + '"}}';

					examples[name] = this.handlebars.compile(partial);
				}
			}
		}

		return examples;
	},

	generate : function(source) {
		this.source = source;

		var options = this.options;

		return new Promise(function(resolve, reject) {
			this.kss.parse(this.source, options, function(err, styleguide) {
				var files    = {};
				var sections = this.setStyleguide(styleguide).getStyleguideSections('*');

				this.registerPartials(this.getSectionPartials(sections));

				this.examples = this.generateExamples(sections);
				this.pages    = this.generatePages(sections.filter(function(section) {
					return section.depth() <= options.fileDepth;
				}));

				for (var file in this.examples)
					files[file] = this.example(this.examples[file]);

				for (var file in this.pages)
					files[file] = this.template(this.pages[file]);

				for (var file in this.assets)
					files[file] = this.assets[file];

				resolve(files);
			}.bind(this));
		}.bind(this));
	}

};

module.exports = function(source, options) {
	return new Kraftverk(source, options);
};
