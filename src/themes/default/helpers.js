var fs = require('fs');

module.exports = function(kraftverk) {

	return {

		ifTemplate : function(template, options) {
			var sectionTemplate = this.template;

			if (!sectionTemplate) {
				sectionTemplate = 'docs';

				if (this.hasDemo)
					sectionTemplate = 'demo';
			}

			if (sectionTemplate === template) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},

		ifDepth : function(depth, options) {
			if (this.depth === depth) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},

		pages : function(depth, reference) {
			var pages = {};

			for (var i in kraftverk.styleguide) {
				if (depth && kraftverk.styleguide[i].depth !== depth)
					continue;

				if (depth > 1 && reference && kraftverk.styleguide[i].reference.indexOf(reference) !== 0)
					continue;

				pages[i] = kraftverk.styleguide[i];
			}

			return pages;
		},

		docs : function() {
			return kraftverk.docs['index.html'].children;
		},

		nav : function(reference) {
			return kraftverk.options[key];
		},

		option : function(key, parent) {
			return typeof parent === "string" ? kraftverk.options[parent][key] : kraftverk.options[key];
		},

		template : function(name) {
			return name ? 'partial.template.' + name : 'partial.template.demos';
		},

		// markup : function(reference) {
		// 	var demo = reference + '.index';

		// 	console.log(demo)

		// 	// if (!kraftverk.demos[demo])
		// 	// 	return '';

		// 	// return kraftverk.demos[demo].content.markup ? kraftverk.demos[demo].content.markup : kraftverk.demos[demo].content.demo;
		// },

		url : function(reference, ext) {
			return '/' + kraftverk.getPath(reference + (typeof ext === 'string' ? '/' + ext : ''));
		},

		demoUrl : function(reference, modifier) {
			return '/' + kraftverk.getPath(reference + '/' + modifier);
		},

		include : function(file) {
			return fs.readFileSync(process.cwd() + file, 'utf8');
		}
	};

};
