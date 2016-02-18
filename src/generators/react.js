var fs       = require('fs');
var kss      = require('kss');
var path     = require('path');
var reactDoc = require('react-docgen');
var read     = require('fs-readdir-recursive');

var ReactGenerator = function(kraftverk) {
	this.kraftverk = kraftverk;
	this.options   = kraftverk.options;
};

ReactGenerator.prototype = {

	options : {},

	/**
	 * Styleguide Methods
	 */

	parseComponent : function(component) {
		var data = {
			file         : component.file,
			title        : component.section.data.header,
			numeric      : component.section.data.autoincrement,
			description  : component.section.data.description,
			reference    : component.section.data.reference,
			topReference : component.section.data.reference.split('.')[0],
			markup       : '',
			hasDemo      : true,
			modifiers    : {},
			custom       : {},
			props        : component.react.props
		};

		for (var prop in component.react.props) {
			if (component.react.props[prop].type.name === 'enum') {
				data.modifiers[prop] = component.react.props[prop].type.value.map(function(modifier) {
					return {
						value     : modifier.value.replace(/'/g, ''),
						reference : [data.reference, prop, modifier.value].join('.')
					};
				});
			}
		}

		if (this.options.kss.custom) {
			for (var i in this.options.kss.custom) {
				custom = this.options.kss.custom[i].toLowerCase();

				data.custom[custom] = component.section.data[custom];
			}
		}

		return data;
	},

	getStyleguide : function(source) {
		var dir        = path.join(process.cwd(), this.options.src);
		var files      = read(dir);
		var styleguide = [];

		files.forEach(function(filename) {
			var file    = path.join(dir, filename);
			var content = fs.readFileSync(file, 'utf8');

			var section;
			kss.parse(content, {}, function(err, styleguide) {
				section = styleguide.section()[0];
			});

			if (section) {
				styleguide.push({
					file    : file,
					section : section,
					react   : reactDoc.parse(content)
				});
			}
		});

		return Promise.resolve(styleguide.map(this.parseComponent.bind(this)));
	},

	/**
	 * Demo Methods
	 */

	generateDemos : function(section, data, partial) {
		data.content = `<div id="demo-${section.reference}"></div>`;

		this.kraftverk.putFile(
			this.kraftverk.getPath(path.join(section.reference, 'index')),
			partial(data)
		);

		this.kraftverk.putFile('main.js', 'var React = require("react"), ReactDOM = require("react-dom");', true);
		this.kraftverk.putFile('main.js', this.getDemoScript(section.file, section.reference), true);

		var modifier, json;
		for (var mod in section.modifiers) {
			for (i = 0, l = section.modifiers[mod].length; i < l; i++) {
				modifier     = section.modifiers[mod][i];
				data.content = `<div id="demo-${modifier.reference}" data-json='${JSON.stringify({[mod] : modifier.value})}'></div>`;

				this.kraftverk.putFile(
					this.kraftverk.getPath(path.join(modifier.reference)),
					partial(data)
				);

				this.kraftverk.putFile('main.js', this.getDemoScript(section.file, modifier.reference), true);
			}
		}
	},

	getDemoScript : function(file, reference) {
		var demoFile = file.replace('.js', this.options.react.demo);

		if (!fs.existsSync(demoFile))
			throw new Error(`Demo not found in expected path "${demoFile}"`);

		return `(function(R, render) {
var component = require("${demoFile}").default;
var props = require("${demoFile}").props;

var node = document.getElementById("demo-${reference}");

if (node) {
	var dataProps = JSON.parse(node.getAttribute('data-json'));

	Object.assign(props, dataProps);

	render(R.createElement(component, props), node);
}
})(React, ReactDOM.render);`;
	}

};

module.exports = function(kraftverk) {
	return new ReactGenerator(kraftverk);
};
