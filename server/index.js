require('./apm')
const express = require('express')
const logger = require('./logger')
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: 'https://1d7f0aefb4044cecb7e09476367d4623@o174217.ingest.sentry.io/1255798',
  beforeSend (event) {
    if (process.env.NODE_ENV === 'production') {
      return event
    }

    // disable sending events in development
    return undefined
  },
})

const argv = require('minimist')(process.argv.slice(2))
const setup = require('./middlewares/frontendMiddleware')
const isDev = process.env.NODE_ENV !== 'production'
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false
const resolve = require('path').resolve
const app = express()

app.use(Sentry.Handlers.requestHandler())

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi)

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(__dirname, '../build'),
  publicPath: '/',
})

app.use(Sentry.Handlers.errorHandler())

// get the intended port number, use port 3000 if not provided
const port = argv.port || process.env.PORT || 3000

// Start your app.
app.listen(port, (err) => {
  if (err) {
    return logger.error(err.message)
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr)
      }

      logger.appStarted(port, url)
    })
  } else {
    logger.appStarted(port)
  }
})
