/* eslint-disable global-require */
const express = require('express')
const path = require('path')
const compression = require('compression')
const pkg = require(path.resolve(process.cwd(), 'package.json'))
const injectData = require('./injectData')
const precacheAPI = require('./precacheAPI')
const _fs = require('fs')
const skipMap = require('skip-map')

require('./data-injectors/rootNode')
require('./data-injectors/clusters')
require('./data-injectors/background')
require('./data-injectors/apiUrls')
require('./data-injectors/graphName')

function createIndexHandler (fs, outputPath) {
  return (req, res) => {
    let graphName = 'open'
    if (req.params && req.params.graphName) {
      graphName = req.params.graphName
    } else if (process.env.NODE_ENV === 'production') {
      graphName = 'open'

      // TODO: remove the need for this
      // Sometimes express doesn't create the req.params
      const segments = req.url.split('/')
      if (segments[1] === 'graph' && segments[2]) {
        graphName = segments[2]
      }
    }

    console.log('serving index for graph: ', graphName, req.params, req.url)

    fs.readFile(path.join(outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404)
      } else {
        // This is depreciated. Use precacheAPI instead
        injectData([
          'root-node',
          'clusters',
          'background',
          'apiUrls',
          'graphName',
        ], file.toString(), graphName)
          .then(html => {
            // These routes will be loaded from cache on the client
            // instead of going over the network
            // Use this for any api requests needed for the initial render
            // to reduce time needed to get the front end ready
            return precacheAPI([
            // EXAMPLE:
            // {
            // path: 'topics/verbs',
            // // Set to false when the api response is user-specific
            // // If true, this will continue working even when the api server is down
            // cache: true,
            // load() {
            //   return api.get('topics/verbs')
            // }
            // }
            ], html)
          })
          .then(html => {
            res.send(html)
          })
          .catch((err) => {
            console.log(err)
            res.send(file.toString())
          })
      }
    })
  }
}

// Dev middleware
const addDevMiddlewares = (app, webpackConfig) => {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(webpackConfig)
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    logLevel: 'warn',
    stats: 'errors-only',
  })

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem

  const indexHandler = createIndexHandler(fs, compiler.outputPath)

  // The webpack dev server middleware can not handle the index
  // otherwise we can't inject data
  app.get('/', indexHandler)
  app.get('/graph/:graphName', indexHandler)

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))

  if (pkg.dllPlugin) {
    app.get(/\.dll\.js$/, (req, res) => {
      const filename = req.path.replace(/^\//, '')
      res.sendFile(path.join(process.cwd(), pkg.dllPlugin.path, filename))
    })
  }

  app.get('*', indexHandler)
}

// Production middlewares
const addProdMiddlewares = (app, options) => {
  const publicPath = options.publicPath || '/'
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build')
  const indexHandler = createIndexHandler(_fs, outputPath)
  // compression middleware compresses your server responses which makes them
  // smaller (applies also to assets). You can read more about that technique
  // and other good practices on official Express.js docs http://mxs.is/googmy
  app.use(compression())
  app.use(skipMap())
  app.get('/', indexHandler)
  app.use(publicPath, express.static(outputPath))

  app.get('*', indexHandler)
}

/**
 * Front-end middleware
 */
module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd) {
    addProdMiddlewares(app, options)
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel')
    addDevMiddlewares(app, webpackConfig)
  }

  return app
}
