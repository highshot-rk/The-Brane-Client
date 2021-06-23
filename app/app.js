
/* global location */
/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
import 'core-js'

/* Setup error tracking before most of the code */
import Raven from 'raven-js'

import './styles/main.scss'
import './styles/index'
import GlobalStyles from './styles/base.js'
import AutoSuggestStyles from './styles/react-autosuggest'

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import history from 'utils/history'
import 'sanitize.css/sanitize.css'

// Import root app
import App from 'containers/App'

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider'

import { HelmetProvider } from 'react-helmet-async'
import configureStore from './store'

// Import i18n messages
import { translationMessages } from './i18n'
import { init } from 'api'
import { StyleSheetManager } from 'styled-components'
import { Route } from 'react-router-dom'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'

const isLocalhost = location.hostname === 'localhost'

Raven
  .config('https://1d7f0aefb4044cecb7e09476367d4623@sentry.io/1255798', {
    release: process.env.RELEASE,
  })

if (!isLocalhost) {
  Raven.install()
}

if (location.hostname === 'app.thebrane.com') {
  LogRocket.init('nesun0/the-brane', {
    dom: {
      inputSanitizer: true,
    },
    network: {
      requestSanitizer: request => {
        if (request.url.toLowerCase().indexOf('login') !== -1) {
          return null
        }
        return request
      },
    },
  })
  setupLogRocketReact(LogRocket)
}

// Create redux store with history
const initialState = {}
const store = configureStore(initialState, history, Raven)

init(store)

const MOUNT_NODE = document.getElementById('app')
const GLOBAL_TARGET = document.getElementById('global-styles')

const ConnectedApp = props => (
  <Provider store={store}>
    {/* Styled components would modify the stylesheet when new components were rendered */}
    {/* Since the stylesheet also had the body's background image the web browser would */}
    {/* re-download the image which would cause the plain background to show until it finished */}
    {/* Here we are using a separate element just for global styles so it won't be modified */}
    <StyleSheetManager disableCSSOMInjection target={GLOBAL_TARGET}>
      <GlobalStyles />
    </StyleSheetManager>
    <LanguageProvider messages={props.messages}>
      <ConnectedRouter history={history}>
        <HelmetProvider>
          <Route render={(location) => {
            return (
              <App location={location} />
            )
          }} />
          <AutoSuggestStyles />
        </HelmetProvider>
      </ConnectedRouter>
    </LanguageProvider>
  </Provider>
)

ConnectedApp.propTypes = {
  messages: PropTypes.object,
}

const render = messages => {
  ReactDOM.render(<ConnectedApp messages={messages} />, MOUNT_NODE)
}

if (module.hot) {
  // Hot reloadable translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE)
    render(translationMessages)
  })
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'))
  })
    .then(() =>
      Promise.all([
        import('intl/locale-data/jsonp/en.js'),
      ])
    )
    .then(() => render(translationMessages))
    .catch(err => {
      throw err
    })
} else {
  render(translationMessages)
}

// We had used service workers, but they caused
// problems with how we injected data into the html file
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready
    .then(registration => {
      registration.unregister()
    })
    .catch(error => {
      console.error(error.message)
    })
}
