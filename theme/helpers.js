module.exports = function(kraftverk) {

	return {

		ifTemplate : function(template, options) {
			var sectionTemplate = this.template;

			if (!sectionTemplate && this.markup)
				sectionTemplate = 'example';

			if (!sectionTemplate && !this.markup)
				sectionTemplate = 'docs';

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

			for (var page in kraftverk.pages) {
				if (depth && kraftverk.pages[page].depth !== depth)
					continue;

				if (depth > 1 && reference && kraftverk.pages[page].reference.indexOf(reference) !== 0)
					continue;

				pages[page] = kraftverk.pages[page];
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
			return name ? 'partial.template.' + name : 'partial.template.examples';
		},

		markup : function(reference, modifier) {
			var example = kraftverk.getPath(reference + '/index');

			return kraftverk.examples[example] ? kraftverk.examples[example].content : '';
		},

		url : function(reference) {
			return '/' + kraftverk.getPath(reference);
		},

		exampleUrl : function(reference, modifier) {
			return '/' + kraftverk.getPath(reference + '/' + modifier);
		},

	};

};
