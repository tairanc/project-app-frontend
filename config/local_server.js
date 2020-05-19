const chalk = require('chalk')
const express = require('express')
const opn = require('opn')
const path = require('path')
const proxyMiddleware = require('http-proxy-middleware')
const app = express()
const utils = require('./utils')
const config = require('./common.js')
const HOST = utils.getIP()
const proxyTable = config.server.proxyTable

Object.keys(proxyTable).forEach((context) => {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(express.static(config.LOCAL_SERVER_PATH))

app.listen(config.LOCAL_SERVER_PORT, () => {
    console.log(chalk.cyan(`Starting server on http://${HOST}:${config.LOCAL_SERVER_PORT}`))
    opn(`http://${HOST}:${config.LOCAL_SERVER_PORT}`)
})