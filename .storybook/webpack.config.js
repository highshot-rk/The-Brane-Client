const path = require('path')
const baseDir = path.resolve(__dirname, '../app')

// load the dev config from react-boilerplate
const devConfig = require('../internals/webpack/webpack.dev.babel')

module.exports = ({ config }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...devConfig.module.rules
    ]
  },
  resolve: {
    ...config.resolve,
    extensions: [
      ...devConfig.resolve.extensions,
    ],
    modules: [
      ...config.resolve.modules,
      baseDir
    ]
  }
})
