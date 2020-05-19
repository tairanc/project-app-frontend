const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

const config = require('./common.js')

const webpackConfig = merge(baseWebpackConfig, {
    //生产模式'production'
    //对于打包速度进行优化
    //不支持watching
    //自动设置process.env.NODE_ENV的值为production
    //自动对代码进行压缩等
    //开启 NoEmitOnErrorsPlugin   在编译出现错误时，自动跳过输出阶段。这样可以确保编译出的资源中不会包含错误。
    //开启 ModuleConcatenationPlugin  开启 optimization.minimize
    mode:'production',
    entry: {
        app: [`${config.SRC_PATH}/pages/app.js`]
    },
    output: {
        path: config.DIST_PATH,
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js'
    },
    //是否启用压缩 , optimization.minimizer 制定压缩库, 默认 uglifyjs-webpack-plugin
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: false
                }
            })  // use OptimizeCSSAssetsPlugin
        ],
        splitChunks: {  //代替 CommonsChunkPlugin
            cacheGroups: {
                lib: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    name: 'lib',
                    enforce: true,
                    chunks: "all"
                },
                // styles: {
                //     name: 'styles',
                //     test: /\.scss|css$/,
                //     chunks: 'all',    // merge all the css chunk to one file
                //     enforce: true
                // }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    }
})

webpackConfig.plugins = webpackConfig.plugins.concat([
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[name].[contenthash].css',
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /css\/.+\.css$/,
        cssProcessorOptions: {
            discardComments: { removeAll: false },
            safe: true,
            autoprefixer: false
        }
    }),
    new BundleAnalyzerPlugin({
        analyzerHost: 'localhost',
        analyzerPort: 8887,
        openAnalyzer: false,
    })
])

if (config.copyImg){
    webpackConfig.plugins.push(
        new CopyWebpackPlugin([ // 复制文件夹
            {
                from: config.imgPath,
                to: config.imgCopyPath,
                ignore: ['.*']
            }
        ])
    )
}

module.exports = webpackConfig