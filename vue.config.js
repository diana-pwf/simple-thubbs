module.exports = {
    publicPath: '/',
    devServer: {
        proxy: {  //配置跨域
            '/api': {
                target: 'http://simplebbs.iterator-traits.com/api',
                changOrigin: true,  //允许跨域
                pathRewrite: {
                    '^/api': ''
                }
            },
        }
    },
    lintOnSave:false
}