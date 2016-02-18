var fs         = require('fs');
var path       = require('path');
var mkdirp     = require('mkdirp');
var marked     = require('marked');
var handlebars = require('handlebars');
var read       = require('fs-readdir-recursive');
var generators = require('./generators');
var themes     = require('./themes');

var Kraftverk = function(options) {
    this.options = options;
    this.gen     = generators[options.generator](this);
    this.theme   = themes[this.options.theme.name](this);
    this.demo    = handlebars.compile(fs.readFileSync(__dirname + '/templates/demo.hbs', 'utf8'));

    this.theme.prepare();

    this.putFile('main.js', '');

    this.options.styles.forEach(function(style) {
        this.putFile('main.js', `require('${style}');`, true);
    }.bind(this));
};

Kraftverk.prototype = {

    options    : {},
    pages      : {},
    styleguide : null,

    putFile : function(name, content, append) {
        var file = path.join(process.cwd(), this.options.public, this.options.dist, name)

        mkdirp(path.dirname(file), function() {
            if (append) {
                fs.appendFile(file, content);
            } else {
                fs.writeFile(file, content);
            }
        });
    },

    getPath : function(reference) {
        return reference.replace(/\./g, '/') + '.html';
    },

    generateDocs : function() {
        var dir      = this.options.docs.dir;
        var index    = this.options.docs.index;

        if (!fs.existsSync(path.join(dir, index)))
            dir = path.join(__dirname, 'docs');

        var docsFiles = read(dir);
        var children  = {};

        docsFiles.forEach(function(filename) {
            if (filename === index) return;

            var docFile = path.join(dir, filename);
            var name    = filename.replace('.md', '');
            var file    = path.join('docs', name + '.html');

            fs.readFile(docFile, 'utf8', function(err, data) {
                if (err) throw new Error(`Doc file ${docFile} was not found.`);

                this.putFile('index.html', this.theme.template({
                    name : this.options.docsTitle,
                    doc  : marked(data)
                }));
            }.bind(this));

            children[file] = name;
        }.bind(this));

        var indexFile = path.join(dir, index);

        fs.readFile(indexFile, 'utf8', function(err, data) {
            if (err) throw new Error(`Doc file ${indexFile} was not found.`);

            this.putFile('index.html', this.theme.template({
                name     : this.options.docsTitle,
                doc      : marked(data),
                children : children
            }));
        }.bind(this));
    },

    generateDemos : function(styleguide) {
        var section;

        for (var i = 0, l = styleguide.length; i < l; i++) {
            section = styleguide[i];

            if (section.hasDemo) {
                this.gen.generateDemos(section, {
                    height     : section.custom.iframeheight === undefined ? 'height: auto;' : 'height: ' + section.custom.iframeheight + ';',
                    background : section.custom.transparent === 'false' ? '' : 'background: none;'
                }, this.demo);
            }
        }
    },

    generatePages : function(styleguide) {
        if (!styleguide.length) return {};

        for (var i = 0, l = styleguide.length; i < l; i++) {
            this.putFile(
                this.getPath(styleguide[i].reference),
                this.theme.template(styleguide[i])
            );
        }
    },

    build : function() {
        var options = this.options;

        return this.gen.getStyleguide(options.src)
            .then(function(styleguide) {
                this.styleguide = options.sections || [];
                this.styleguide = this.styleguide.concat(styleguide);

                this.styleguide = this.styleguide.map(function(section) {
                    section.depth = section.reference.split('.').length;

                    return section;
                });

                this.generateDocs();
                this.generateDemos(this.styleguide);
                this.generatePages(this.styleguide.filter(function(section) {
                    return section.depth <= options.kss.depth;
                }));
            }.bind(this));
    }

};

module.exports = function(options) {
    return new Kraftverk(options);
};
