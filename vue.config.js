const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  chainWebpack: config => {
    // 使用 provideplugin 注入全局模块变量
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        mapActions: ['vuex', 'mapActions'],
        mapGetters: ['vuex', 'mapGetters'],
        mapMutations: ['vuex', 'mapMutations'],
        mapState: ['vuex', 'mapState']
      }
    ])
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ]
    },
    plugins: [
      // new BundleAnalyzerPlugin()
    ]
  }
}
