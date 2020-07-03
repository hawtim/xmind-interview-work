const webpack = require('webpack')
const report = process.env.npm_config_report;

module.exports = {
  chainWebpack: config => {
    // 使用 provideplugin 注入全局模块变量
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [
        {
          mapActions: ['vuex', 'mapActions'],
          mapGetters: ['vuex', 'mapGetters'],
          mapMutations: ['vuex', 'mapMutations'],
          mapState: ['vuex', 'mapState']
        }
      ])
    if (report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
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
    }
  }
}
