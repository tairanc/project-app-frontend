const config = require('./common.js')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');

module.exports = function(proxy){
    return {
        stats:{   //统计信息
            colors: true
        },
        compress: true, //一切服务都启用gzip 压缩：
        disableHostCheck: true, //不检查host地址
        clientLogLevel: 'none',  //阻止消息显示
        // contentBase: paths.appPublic,      //告诉服务器从哪里提供内容
        // publicPath: config.publicPath,
        watchContentBase: true,
        hot: true,               //启用 webpack 的模块热替换特性
        quiet: true,  //启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见
        watchOptions: {  //与监视文件相关的控制选项
            ignored: /node_modules/  //对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除一些巨大的文件夹，例如 node_modules
        },
        host: config.host,
        overlay: false,
        historyApiFallback: {  //当路径中使用点(dot)（常见于 Angular），你可能需要使用 disableDotRule
            disableDotRule: true
        },
        before(app) {
            // This lets us open files from the runtime error overlay.
            app.use(errorOverlayMiddleware());
            // This service worker file is effectively a 'no-op' that will reset any
            // previous service worker registered for the same host:port combination.
            // We do this in development to avoid hitting the production cache if
            // it used the same host and port.
            // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
            app.use(noopServiceWorkerMiddleware());
        },
    }
}