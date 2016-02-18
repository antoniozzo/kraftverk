var url              = require('url');
var path             = require('path');
var express          = require('express');
var webpack          = require('webpack');
var proxy            = require('proxy-middleware');
var webpackDevServer = require('webpack-dev-server');
var makeConfig       = require('./webpack.config');

module.exports = function(options, cb) {
	var devPort  = options.port + 1;
	var app      = new express();
	var config   = makeConfig(devPort, options);
	var compiler = webpack(config);

	app.use(`/${options.public}`, proxy(url.parse(`http://localhost:${devPort}/${options.public}`)));
	app.use('/', express.static(path.join(process.cwd(), options.public, options.dist)));
	app.listen(options.port, cb);

	var bundler = new webpackDevServer(compiler, {
		publicPath : `/${options.public}`,
		inline     : true,
		hot        : true,
		quiet      : false,
		noInfo     : true,
		stats      : {colors : true}
	});

	bundler.listen(devPort);
};
