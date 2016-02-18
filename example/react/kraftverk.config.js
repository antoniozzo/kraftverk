module.exports = {
    generator : 'react',
    src       : 'src/components',

    react : {
        demo : '.kraftverk.js'
    },

    webpack : {
        module : {
            loaders : [
                {
                    test   : /\.css$/,
                    loader : 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less'
                }
            ]
        }
    },

    sections : [
        {
            title     : 'Components',
            reference : 'components'
        }
    ]
}
