const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const config = require('./common.js')
const localPublicPath = 'http://' + config.host + ':' + config.port + '/'
const webpackConfig = merge(baseWebpackConfig, {
    // 自动设置process.env.NODE_ENV的值为development
    // 浏览器调试工具
    // 注释、开发阶段的详细错误日志和提示
    // 快速和优化的增量构建机制
    // 开启 output.pathinfo 在 bundle 中显示模块信息
    // 开启 NamedModulesPlugin
    // 开启 NoEmitOnErrorsPlugin
    mode: 'development', // 开发模式
    devtool: 'cheap-module-source-map', // 选择一种 source map 格式来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度
    entry: {
        app: [
            'webpack-dev-server/client?' + localPublicPath,
            'webpack/hot/only-dev-server',
            `${config.SRC_PATH}/pages/app.js`
        ],
        lib: ['react', 'react-dom', 'react-router',
            'redux', 'react-redux', 'redux-thunk',
            'immutable', 'n-zepto']
    },
    output: {
        path: config.DIST_PATH,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].chunk.js'
    },
    stats: "none"
})

webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
])

module.exports = webpackConfig

