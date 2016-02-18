var React = require("react"), ReactDOM = require("react-dom");(function(R, render) {
var component = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").default;
var props = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").props;

var node = document.getElementById("demo-components.button");

if (node) {
	var dataProps = JSON.parse(node.getAttribute('data-json'));

	Object.assign(props, dataProps);

	render(R.createElement(component, props), node);
}
})(React, ReactDOM.render);(function(R, render) {
var component = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").default;
var props = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").props;

var node = document.getElementById("demo-components.button.color.'red'");

if (node) {
	var dataProps = JSON.parse(node.getAttribute('data-json'));

	Object.assign(props, dataProps);

	render(R.createElement(component, props), node);
}
})(React, ReactDOM.render);(function(R, render) {
var component = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").default;
var props = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").props;

var node = document.getElementById("demo-components.button.color.'blue'");

if (node) {
	var dataProps = JSON.parse(node.getAttribute('data-json'));

	Object.assign(props, dataProps);

	render(R.createElement(component, props), node);
}
})(React, ReactDOM.render);(function(R, render) {
var component = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").default;
var props = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").props;

var node = document.getElementById("demo-components.button.size.'small'");

if (node) {
	var dataProps = JSON.parse(node.getAttribute('data-json'));

	Object.assign(props, dataProps);

	render(R.createElement(component, props), node);
}
})(React, ReactDOM.render);(function(R, render) {
var component = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").default;
var props = require("/Users/antoniozzo/Projects/kraftverk/example/react/src/components/Button/Button.kraftverk.js").props;

var node = document.getElementById("demo-components.button.size.'large'");

if (node) {
	var dataProps = JSON.parse(node.getAttribute('data-json'));

	Object.assign(props, dataProps);

	render(R.createElement(component, props), node);
}
})(React, ReactDOM.render);