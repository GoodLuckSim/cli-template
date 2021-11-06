'use strict'
const path = require('path')
const { name } = require('./package')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const port = 8095 // dev port

module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'development' ? './' : './',
  assetsDir: 'static',
  filenameHashing: true,
  productionSourceMap: process.env.NODE_ENV === 'development',
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    /* 使用代理 */
    proxy: {
      '/f4': {
        // target: process.env.VUE_APP_BASE_YJ_URL,
        target: process.env.VUE_APP_BASE_TARGET_URL,
        // target: process.env.VUE_APP_BASE_DEV_URL,
        changeOrigin: true,
        secure: false,
        ws: false
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 性能配置
    performance: {
      // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
      hints: 'warning',
      // 开发环境设置较大防止警告
      // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
      maxEntrypointSize: 5000000,
      // 最大单个资源体积，默认250000 (bytes)
      maxAssetSize: 3000000
    },
    // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
    output: {
      filename: `./static/js/[name].${new Date().getTime()}.js`,
      chunkFilename: `./static/js/[name].${new Date().getTime()}.js`,
      library: 'qiankun-sys',
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    // 解决字体文件路径404问题
    config.module
      .rule('fonts')
      .test(/.(ttf|otf|eot|woff|woff2)$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options = {
          // limit: 10000,
          name: '/static/fonts/[name].[ext]'
        }
        return options
      })
      .end()
    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-source-map'))

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }

}

