import axios from 'axios'
import { useCacheAdapters, cacheResponse, createSetAuthToken, createWaitForSessionRestored } from './interceptors'
import { getData } from 'utils/injectData'

const {
  apiUrl,
  usersApiUrl,
  contentsApiUrl,
} = getData('apiUrls')

const api = axios.create({
  baseUrl: apiUrl,
})

const userApi = axios.create({
  baseURL: usersApiUrl,
})

let didInit = false
let authToken = null
let waitingForSessionRestored = false
let wasResolved = false
let resolveSessionRestored

let sessionRestoredPromise = new Promise(resolve => {
  resolveSessionRestored = resolve
})

export function init (store) {
  if (didInit) {
    throw new Error('init already called for api')
  }
  didInit = true
  api.interceptors.request.use(createWaitForSessionRestored(() => {
    return waitingForSessionRestored
  }, sessionRestoredPromise))
  api.interceptors.request.use(createSetAuthToken(() => authToken))
  api.interceptors.request.use(useCacheAdapters)
  api.interceptors.response.use(cacheResponse)
  // Request handlers are run in last added, first run,
  // the opposite of response handlers
  api.interceptors.request.handlers.reverse()

  userApi.interceptors.request.use(createWaitForSessionRestored(() => {
    return waitingForSessionRestored
  }, sessionRestoredPromise))
  userApi.interceptors.request.use(createSetAuthToken(() => authToken))
  // Request handlers are run in last added, first run,
  // the opposite of response handlers
  userApi.interceptors.request.handlers.reverse()

  store.subscribe(() => {
    const state = store.getState()
    authToken = state?.auth?.authToken?.user.token
    waitingForSessionRestored = state?.auth?.restoringSession && !authToken

    if (authToken && !waitingForSessionRestored && !wasResolved) {
      resolveSessionRestored()
      wasResolved = true
    }
  })
}

export default api
export {
  userApi,
}

/**
* @param {string} contentType image || document
* @param {string} itemId topics||links / id topics/123456
*/
export const getContentURL = (contentType, itemId) => {
  return `${contentsApiUrl}${contentType}/${itemId}`
}
