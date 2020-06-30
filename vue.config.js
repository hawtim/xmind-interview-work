const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        // {
        //   test: /\.(txt|csv|mmdb)$/,
        //   use: [
        //     {
        //       loader: 'file-loader',
        //       options: {
        //         name: "[path][name].[ext]",
        //         emitFile: true,
        //       },
        //     },
        //   ],
        // },
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
    // plugins: [new BundleAnalyzerPlugin()]
  }
}
