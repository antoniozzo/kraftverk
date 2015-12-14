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

Docs coming...
