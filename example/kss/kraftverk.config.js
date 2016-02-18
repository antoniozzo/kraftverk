module.exports = {
    generator : 'kss',
    src       : 'src',
    styles    : ['main.less'],
    webpack   : {
        module : {
            loaders : [
                {
                    test   : /\.less$/,
                    loader : 'style!css!less'
                }
            ]
        }
    }
}
