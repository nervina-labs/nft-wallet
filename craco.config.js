const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  babel: {
    plugins: ['babel-plugin-styled-components'],
  },
  webpack: {
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === 'production') {
        // remove console in production
        const TerserPlugin = webpackConfig.optimization.minimizer.find(
          (i) => i.constructor.name === 'TerserPlugin'
        )
        if (TerserPlugin) {
          TerserPlugin.options.terserOptions.compress.drop_console = true
        }
        if (process.env.ANALYZE_BUNDLE) {
          webpackConfig.plugins.push(new BundleAnalyzerPlugin())
        }
      }

      return webpackConfig
    },
  },
}
