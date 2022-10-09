const autoprefixer = require('autoprefixer')
const path = require('path')
const { name } = require('./package.json')
const devServerPort = 10000 // TODO: get this variable from setting.ts
const resolve = (dir) => path.join(__dirname, dir)
console.log(process.env.VUE_APP_BASE_API)
module.exports = {
  publicPath: '/',
  // transpileDependencies: ['common'],
  // chainWebpack: (config) => config.resolve.symlinks(false),
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all', // 仅提取按需载入的module
        minSize: 500000, // 代码分割最小的模块大小
        maxSize: 300000, // 代码分割最大的模块大小，大于这个值要进行代码分割，一般使用默认值
        minChunks: 1, // 被提取的chunk最少需要被多少chunks共同引入
        maxAsyncRequests: 5, // 最大按需载入chunks提取数
        maxInitialRequests: 3, // 最大初始同步chunks提取数
        automaticNameDelimiter: '~', // 默认的命名规则（使用~进行连接）
        name: true,
        cacheGroups: {
          // 缓存组配置，默认有vendors和default
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            minChunks: 5,
            priority: 10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    output: {
      library: `${name}-[name]`,
      // 把子应用打包成umd库格式
      // 当我们把 libraryTarget 设置为 umd 后，我们的 library 就暴露为所有的模块定义下都可运行的方式		了，主应用就可以获取到微应用的生命周期钩子函数了
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
  // publicPath: process.env.NODE_ENV === 'production' ? '/mobile/' : '/mobile/',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    progress: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        // target: 'http://36.112.133.220:8005',
        target: 'http://zkyth2-api.xitalent.com/',
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        // pathRewrite: {'^/api' : ''}
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
  },
}
