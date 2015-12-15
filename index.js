var Kraftverk = function(options) {
	this.setOptions(options);

	this.themeOptions = this.getThemeOptions();
	this.docs         = this.getDocs();
	this.assets       = this.getThemeAssets();

	this.registerPartials(this.getThemePartials());
	this.registerHelpers(this.getThemeHelpers());

	this.theme   = this.handlebars.compile(this.getThemeFile('index'));
	this.example = this.handlebars.compile(this.getThemeFile('example'));
};

Kraftverk.prototype = {

	/**
	 * Properties
	 */

	fs         : require('fs'),
	read       : require('fs-readdir-recursive'),
	kss        : require('kss'),
	handlebars : require('handlebars'),
	marked     : require('marked'),
	beautify   : require('js-beautify').html,

	styleguide : null,
	theme      : null,
	pages      : {},

	themeOptions : {
		depth    : 2,
		assets   : "assets",
		partials : "partials",
		helpers  : "helpers.js",
		custom   : ['Template', 'Transparent']
	},

	options : {
		title     : 'Style Guide',
		theme     : __dirname + '/theme',
		styles    : [],
		scripts   : [],
		templates : 'src/templates',

		docs : {
			title : 'Documentation',
			dir   : 'src/docs',
			index : 'index.md',
		}
	},

	/**
	 * Setters
	 */

	setOptions : function(opts, nested) {
		var options = nested ? [] : this.options;

		if (typeof opts === 'object') {
			for (var i in opts) {
				options[i] = this.setOptions(opts[i], true);
			}
		} else {
			return opts;
		}

		return nested ? options : this.options = options;
	},

	setStyleguide : function(styleguide) {
		this.styleguide = styleguide;

		return this;
	},

	/**
	 * Getters
	 */

	getDocs : function(reference) {
		var docs     = {};
		var children = {};
		var dir      = this.options.docs.dir;
		var index    = this.options.docs.index;

		if (!this.fs.existsSync(dir + '/' + index))
			dir  = this.options.theme + '/src/docs';

		var docsIndex = this.fs.readFileSync(dir + '/' + index, 'utf8');
		var docsFiles = this.read(dir);

		docs['index.html'] = {
			name     : this.options.docsTitle,
			doc      : this.marked(docsIndex),
			children : {}
		};

		docsFiles.forEach(function(filename) {
			if (filename === index) return;

			var name = filename.replace('.md', '');
			var file = 'docs/' + name + '.html';

			docs[file] = {
				name : name,
				doc  : this.marked(this.fs.readFileSync(dir + '/' + filename, 'utf8'))
			};

			docs['index.html'].children[file] = name;
		}.bind(this));

		return docs;
	},

	getThemeOptions : function(defaultOptions) {
		var file = this.options.theme + '/theme.json';

		return this.fs.existsSync(file) ? JSON.parse(this.fs.readFileSync(file, 'utf8')) : defaultOptions;
	},

	getThemeFile : function(path) {
		return this.fs.readFileSync(this.options.theme + '/' + path + '.hbs', 'utf8');
	},

	getThemeAssets : function() {
		var assets      = {};
		var assetsDir   = this.options.theme + '/' + this.themeOptions.assets;
		var assetsFiles = this.read(assetsDir);

		assetsFiles.forEach(function(filename) {
			var name = this.themeOptions.assets + '/' + filename;
			assets[name] = this.fs.readFileSync(assetsDir + '/' + filename);
		}.bind(this));

		return assets;
	},

	getThemePartials : function() {
		var partials      = {};
		var partialsDir   = this.options.theme + '/' + this.themeOptions.partials;
		var partialsFiles = this.read(partialsDir);

		partialsFiles.forEach(function(filename) {
			var matches = /^([^.]+).hbs$/.exec(filename);

			if (!matches) return;

			var name = 'partial.' + matches[1];

			partials[name] = {
				markup : this.fs.readFileSync(partialsDir + '/' + filename, 'utf8')
			};
		}.bind(this));

		return partials;
	},

	getThemeHelpers : function() {
		return require(this.options.theme + '/' + this.themeOptions.helpers)(this);
	},

	getStyleguideSections : function(query) {
		return this.styleguide.section(query);
	},

	getPath : function(reference) {
		return reference.replace(/\./g, '/') + '.html';
	},

	getPartial : function(section) {
		var partial = {
			markup : section.markup(),
			data   : {}
		};

		if (partial.markup.match(/^[^\n]+\.hbs$/)) {
			var file = this.options.templates + '/' + partial.markup;

			if (this.fs.existsSync(file)) {
				partial.markup = this.fs.readFileSync(file, 'utf8');
			} else {
				partial.markup = 'NOT FOUND';
			}

			file = file.replace('.hbs', '.json');

			if (this.fs.existsSync(file)) {
				partial.data = JSON.parse(this.fs.readFileSync(file, 'utf8'));
			}
		}

		return partial;
	},

	getSectionPartials : function(sections) {
		var partials = {};

		for (var i = 0, l = sections.length; i < l; i++) {
			if (sections[i].markup()) {
				var name = sections[i].reference();

				partials[name] = this.getPartial(sections[i]);
			}
		}

		return partials;
	},

	getSectionData : function(section) {
		var data = section.toJSON();

		data.numeric      = section.data.autoincrement;
		data.topReference = section.data.reference.split('.')[0];

		var custom;
		for (var i in this.themeOptions.custom) {
			custom = this.themeOptions.custom[i].toLowerCase();

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
		for (var i in partials) {
			this.handlebars.registerPartial(i, partials[i].markup);
		}

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
		var section, modifier, name, partial, data, i1, l1, i2, l2;

		for (i1 = 0, l1 = sections.length; i1 < l1; i1++) {
			section = sections[i1];

			if (section.markup()) {
				name    = this.getPath(section.reference() + '/index');
				partial = '{{> ' + section.reference() + '}}';
				data    = this.partials[section.reference()].data;

				examples[name] = {
					background : section.data.transparent === 'false' ? '' : 'background: none;',
					content    : this.compile(partial, data)
				};
			}

			if (section.data.modifiers) {
				for (i2 = 0, l2 = section.data.modifiers.length; i2 < l2; i2++) {
					modifier = section.data.modifiers[i2];
					name     = this.getPath(section.reference() + '/' + modifier.className());
					partial  = '{{> ' + section.reference() + ' modifier_class="' + modifier.className() + '"}}';

					examples[name] = {
						background : section.data.transparent === 'false' ? '' : 'background: none;',
						content    : this.compile(partial, data)
					};
				}
			}
		}

		return examples;
	},

	generate : function(source) {
		this.source = source;

		var options      = this.options;
		var themeOptions = this.themeOptions;

		return new Promise(function(resolve, reject) {
			this.kss.parse(this.source, options, function(err, styleguide) {
				var files    = {};
				var sections = this.setStyleguide(styleguide).getStyleguideSections('*');

				this.partials = this.getSectionPartials(sections);

				this.registerPartials(this.partials);

				this.examples = this.generateExamples(sections);
				this.pages    = this.generatePages(sections.filter(function(section) {
					return section.depth() <= themeOptions.depth;
				}));

				var file;

				for (file in this.examples) {
					files[file] = this.example(this.examples[file]);
				}

				for (file in this.pages) {
					files[file] = this.theme(this.pages[file]);
				}

				for (file in this.assets) {
					files[file] = this.assets[file];
				}

				for (file in this.docs) {
					files[file] = this.theme(this.docs[file]);
				}

				resolve(files);
			}.bind(this));
		}.bind(this));
	},

	compile : function(partial, data) {
		return this.beautify(this.handlebars.compile(partial)(data), {
			max_preserve_newlines : 0
		});
	}

};

module.exports = function(source, options) {
	return new Kraftverk(source, options);
};
