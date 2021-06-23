/**
 * Create the store with dynamic reducers
 */

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { routerMiddleware } from 'connected-react-router'
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors'
import createSagaMiddleware from 'redux-saga'
import createReducer from './reducers'
import createRavenMiddleware from 'raven-for-redux'
import { getStateWith } from 'reselect-tools'
import { batchedSubscribe } from 'utils/redux'
import LogRocket from 'logrocket'

function ravenMiddleware (Raven) {
  return createRavenMiddleware(Raven, {
    breadcrumbDataFromAction (action) {
      if (action.type.startsWith('auth')) {
        const payload = Object.assign({}, (action.payload || {}), {
          authToken: undefined,
          password: undefined,
          passwordConfirmation: undefined,
        })
        action = Object.assign({}, action, {
          payload,
        })
      }

      const result = {}

      // Sentry doesn't allow objects or arrays in the data object
      for (const [key, value] of Object.entries(action.payload || {})) {
        if (typeof value === 'string' || typeof value === 'boolean') {
          result[key] = value
        }
      }

      return result
    },
    actionTransformer (action) {
      return {
        type: action.type,
      }
    },
    stateTransformer (state) {
      return {
        home: state.home,
      }
    },
    getUserContext (state) {
      const auth = state.auth

      return {
        id: auth && auth.userId,
        username: auth && auth.firstName && `${auth.firstName} ${auth.lastName}`,
      }
    },
  })
}

export default function configureAppStore (initialState = {}, history, Raven) {
  const reduxSagaMonitorOptions = {}

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    // NOTE: Uncomment the code below to restore support for Redux Saga
    // Dev Tools once it supports redux-saga version 1.x.x
    // if (window.__SAGA_MONITOR_EXTENSION__)
    //   reduxSagaMonitorOptions = {
    //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
    //   };
    /* eslint-enable */
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions)
  const { run: runSaga } = sagaMiddleware

  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [sagaMiddleware, routerMiddleware(history), LogRocket.reduxMiddleware({
    stateSanitizer: function (state) {
      return {
        ...state,
        auth: undefined,
      }
    },
  })]

  if (Raven) {
    middlewares.push(ravenMiddleware(Raven))
  }

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
      batchedSubscribe,
    }),
  ]

  const store = configureStore({
    reducer: createReducer(),
    preloadedState: initialState,
    // TODO: We should have the serializableCheck enabled, but it is incompatible with immutable
    // Immutable check is disabled because it is extremely, extremely slow when we have many thousands of relatives
    // on the fixed path
    middleware: [...getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }), ...middlewares],
    enhancers,
  })

  getStateWith(() => store.getState())

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      forceReducerReload(store)
    })
  }

  return store
}
