var path    = require('path');
var webpack = require('webpack');
var merge   = require('webpack-merge');

module.exports = function(port, options) {
    var config = {
        devtool : 'cheap-module-eval-source-map',
        entry   : {
            main : [
                `webpack-dev-server/client?http://localhost:${port}`,
                'webpack/hot/dev-server',
                path.join(process.cwd(), options.public, options.dist, 'main.js')
            ]
        },
        output : {
            path     : path.join(__dirname, options.public),
            filename : '[name].js'
        },
        plugins : [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        resolve : {
            modulesDirectories : [
                'node_modules',
                options.src
            ],
            extensions : ['', '.js', '.jsx']
        },
        module : {
            loaders : [
                {
                    test    : /\.js$/,
                    loaders : ['babel']
                }
            ]
        }
    };

    return merge.smart(options.webpack, config);
};
