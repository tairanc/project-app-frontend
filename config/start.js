const path = require('path')
const webpack = require('webpack')
const chalk = require('chalk')
const devConfig = require('./webpack.dev.config.js')
const config = require('./common.js')
const compiler = webpack(devConfig)
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//WebpackDevServer
const WebpackDevServer = require('webpack-dev-server')
const serverConfig = require('./webpackDevServer.config.js')
const devServer = new WebpackDevServer(compiler, serverConfig())
devServer.listen(config.port, config.host, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(chalk.cyan(`Starting server on http://${config.host}:${config.port}`))
})
