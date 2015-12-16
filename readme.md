# Kraftverk

Kraftverk is a style guide generator. Kraftverk uses KSS for parsing CSS comments to later generate a beautiful style guide with alot of useful features.

## Table of contents

- [Usage](#usage)
  - [CLI](#cli)
  - [With Gulp](#with-gulp)
- [Options](#options)
  - [Kraftverk Options](#kraftverk-options)
  - [Theme Options](#theme-options)
- [Default Theme](#default-theme)
  - [Custom Properties](#custom-properties)
    - [Examples](#examples)
      - [Template](#template)
      - [Transparent](#transparent)

## Usage

First you should read up on the [KSS](http://warpspire.com/kss/) documentation & syntax.

### CLI

Currently Kraftverk does not work as a CLI.

### With gulp

Kraftverk has a gulp plugin:

```bash
npm install gulp-kraftverk --save-dev
```

In your `gulpfile.js`:

```js
var gulp      = require('gulp');
var kraftverk = require('gulp-kraftverk');

gulp.task('kraftverk', function() {
	return gulp.src('src/css/**') // or LESS/SASS/SCSS etc...
		.pipe(kraftverk(/* options */))
		.pipe(gulp.dest('styleguide/'));
});
```

## Options

### Kraftverk Options

Option | Type | Default Value | Description
--- | --- | --- | ---
**title** | *string* | "Styleguide" | The main title of your style guide static site.
**theme** | *string* | "/theme" | Path to the style guide theme.
**styles** | *array* | [] | Array of stylesheets to be included in your site examples.
**scripts** | *array* | [] | Array of scripts to be included in your site examples.
**templates** | *string* | "src/templates" | Path to the handlebars templates for external markup.
**docs** | *object* | | Documentation options
**docs.dir** | *string* | "src/docs" | Path to markdown doc files.
**docs.title** | *string* | "Documentation" | Title of the docs home page.
**docs.index** | *string* | "index.md" | Path to the home page relative to the *docs.dir*.

### Theme Options

Option | Type | Default Value | Description
--- | --- | --- | ---
**depth** | *integer* | 2 | How deep in the KSS hierarchy to generate unique style guide pages.
**assets** | *string* | "assets" | Relative path to the theme's assets.
**partials** | *string* | "partials" | Relative path to the theme's handlebars partials.
**helpers** | *string* | "helpers.js" | Relative path to the theme's handlebars helpers file.
**custom** | *array* | ['Template', 'Transparent'] | Custom comment properties used in the theme.

## Default Theme

### Custom Properties

The default kraftverk theme supports additional comment properties besides the ones in KSS.

Option | Type | Default Value | Description
--- | --- | --- | ---
**Template** | docs/example/colors | *dynamic* | Template used for documenting you KSS comment. Kraftverk theme try to guess your prefered template between *docs* and *example* depending of you having a `Markup:` in your KSS comment or not.
**Transparent** | true/false | true | Force the iframe (used for displaying examples) background to transparent. Useful for when you want to showcase single components vs. complete page templates. Defaults to true since it's more common to display smaller components by themself.

#### Examples

*All examples are using LESS.*

##### Template

Display your color variables in the style guide:

```less
// Colors
//
// @red  - #ff6666
// @blue - #6666ff
//
// Template: colors
//
// Styleguide: variables.colors

@red  : #ff6666
@blue : #6666ff
```

##### Transparent

Use your site background in the style guide example (useful for showcasing pages):

```less
// Home
//
// Markup: pages/home.hbs
//
// Transparent: false
//
// Styleguide: pages.home

.home {
    // styles
}
```
