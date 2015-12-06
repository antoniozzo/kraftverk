## Coding Standards

### JavaScript Coding Standards

#### Modules / Browserify

For maximun flexibility, JavaScript should be written modular. We use Browserify to bring the NodeJS / CommonJS syntax to the front-end.

Write a JavaScript module like this:

```
/**
 * [Module description]
 */

var Module = function() {
	// Init properties here in the constructor
	this.property = null;
}

Module.prototype.method = function(param) {
	return param * 2;
}

module.exports = new Module();
```

Include and use in main.js (or other module):

```
var module = require(./modules/module);

module.method(2);
```

Regular NPM modules can also be included the same way:

```
var $ = require('jquery');

$('body').remove();
```

A healthy **main.js** should not have more than 140 lines of code!

#### Directory Structure

Suggested directory structure below:

```
assets/
	node_modules/
	src/
		js/
			modules/
				moduleName.js
				[...]
			main.js
```

### CSS Coding Standards

#### Styleguide

Make sure to comment your css declarations like this to have them included in this living styleguide:

```
/*
Textarea

It's a textarea.

Markup:
<textarea>This is content</textarea>

Styleguide: forms.textarea
*/

textarea {
	background: #eee;
}
```

For complete syntax, read [KSS Comment Syntax](http://warpspire.com/kss/syntax/).

#### Properties

Properties should be written in groups seperated by a new line.
The property group are as follow:

* Mixins
* Box
* Border
* Background
* Text
* Other

Example:

```
.selector {
	.mixin();

	display: block;
	height: 200px;
	width: 200px;
	float: left;
	position: relative;

	border-radius: 10px;
	border: 1px solid #333;

	.box-shadow(10px 10px 5px #888);
	background-color: #fff;

	color: red;
	font-size: 12px;
	text-transform: uppercase;

	vertical-align: middle;
	content: '';
}
```

#### Components

"Components" derive from Web Components as should be treated as self-contained styling & markup.
The majority of your site should be written with components.

Follow this order to keep the component clean and easy to use:
* Component (For multiple-word class names separate with uppercase, AKA camelCase)
  * Component modifiers (Separate modifiers with 2 dashes "--")
  * Media queries
* Sub-Components (Separate modifiers with 1 dash "-")

Complete structure below:

```
/*
My component

This is my component

Markup:
<div class="component component--modifier">
	<h2>Component with modifier</h2>
	<div class="component-subComponent">
		<h3>Sub-Component with modifier</h3>
	</div>
</div>

Styleguide components.component
*/

.component {
	// Component properties

	@media @mobileOnly {
		// Mobile properties for the component
	}

	&.component--modifier {
		// Modifier properties

		@media @mobileOnly {
			// Mobile properties for the modifier
		}
	}
}

.component-subComponent {
	// Sub-Component properties

	.component--modifier & {
		// Sub-Component properties affected by parent component modifier
	}
}
```

##### Components & Mixins

A good way of making components self contained but also allow other components to use some of the styling is to abstract the component into mixins.

For example:

```
/*
Button

A button

Styleguide components.button
*/

#btn {
	.btn() {
		display: block;
		padding: 1rem 2rem;

		border-radius: 4px;
	}

	.color(@bgColor: #000, @textColor: #fff) {
		background-color: @bgColor;

		color: @textColor;
	}
}

.btn {
	#btn > .btn();

	&.btn--red {
		#btn > .color(red, #fff);
	}

	&.btn--blue {
		#btn > .color(blue, #fff);
	}
}
```

Another component can now use the #btn namespaced mixins:

```
/*
Card

Something that should have similar styling to buttons.

Styleguide components.card
*/

.card {
	#btn > .btn();
	#btn > .color(purple, blue);

	// Other properties a .card should have
}
```

#### Directory Structure

Suggested directory structure below:

```
assets/
	bower_components/
	src/
		css/
			base/
				global.less
				variables.less
			components/
				componentName.less
				[...]
			mixins/
				mixinName.less
				[...]
			main.less
```

main.less:

```
// Vendor
../../bower_components/package/package.min.css

// Base
base/global.less
base/variables.less

// Mixins
mixins/mixinName.less
[...]

// Components
components/componentName.less
[...]
```

## Dev Tools

### Gulp

Use [Gulp](http://gulpjs.com/) as our task runner.
Your Gulp Directory Structure should look something like this:

```
assets/
	dist/
	src/
	gulp/
		lib/
		tasks/
			task.js
		config.json
	gulpfile.js
```

### Git

We use Git as our version control system and we like the Git Flow branching model. Please see [this guide](https://github.com/oakwood/GitFlowGuide) for more information on how to use it.

GitHub is used for our public repos. Our local server and [GitLab](https://gitlab.com/owcda) for private repos.
