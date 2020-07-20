var path = require('path')

module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack}) => {
        
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf|png|jpg)$/,
            use: ['file-loader']
        })
        return config
    }
}