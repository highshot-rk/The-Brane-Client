import { getData } from '../utils/injectData'
import url from 'url'
import {
  getResponse,
  cacheResponse as storeResponse,
} from './cache'
import {
  findEmbedded,
} from './embedded-documents'
import { featureEnabled } from 'utils/features'

const prefilledCache = getData('precache-api')

function cacheAdapter (config) {
  return new Promise(function (resolve, reject) {
    const response = {
      data: prefilledCache[config.url],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config,
      request: {},
    }

    resolve(response)
  })
}

function indexCacheAdapter ({ data }) {
  return function (config) {
    return new Promise(resolve => {
      const response = {
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      }

      resolve(response)
    })
  }
}

export async function useCacheAdapters (config) {
  config.url = url.resolve(config.baseUrl, config.url)
  const response = await getResponse(config.url)

  // TODO: instead of two cache adapters, insert prefilledCache into indexdb in page load
  if (config.method === 'get' && config.url in prefilledCache) {
    config.adapter = cacheAdapter
  } else if (config.method === 'get' && response) {
    config.adapter = indexCacheAdapter(response)
  }

  return config
}

export function createSetAuthToken (getToken) {
  return function (config) {
    config.headers.common['Authorization'] = `Bearer ${getToken()}`
    return config
  }
}

const accountsEnabled = featureEnabled('accounts')
export function createWaitForSessionRestored (getWaiting, sessionRestoredPromise) {
  return async function (config) {
    if (accountsEnabled && config.userRequired !== false && getWaiting()) {
      console.log('request pending while logging in', config.url)
      await sessionRestoredPromise
    }

    return config
  }
}

export async function cacheResponse (response) {
  if (!featureEnabled('indexedDbCache')) {
    return response
  }

  if (response && response.config.method === 'get') {
    const cacheOptions = response.config.cache || {}

    storeResponse({
      path: response.config.url,
      data: response.data,
      embeddedDocuments: findEmbedded(response.data).concat(cacheOptions.keys || []),
      ttl: cacheOptions.ttl,
      eagerlyStale: cacheOptions.eagerlyStale,
    })
  }

  return response
}
