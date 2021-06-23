const UserError = require('./UserError')

const injectors = {}

/**
 * Array of keys that the cache has expired for
 */
let needsUpdating = []

/**
 * The key is the key of the data, and the value is the time it was last updated
 */
const lastUpdated = {}

/**
 * Injects data in the html file to avoid another round trip to load it.
 *
 * @param {string} keys - keys from the data object
 * @param {string} html - the webpage to inject the data in. It gets injected right before the <title> tag
 * @returns {Promise} resolves with the html to send to the client
 */
module.exports = async function injectData (keys, html, graphName) {
  console.time('preparing data to inject')
  const results = await Promise.all(keys.map(key => prepareData(key, graphName)))
  console.timeEnd('preparing data to inject')
  let errors = []
  results.forEach(({ key, content, error }) => {
    if (error) {
      errors.push(error)
    }
    html = module.exports.injectHtml(key, content, html)
  })
  console.log(errors)
  html = module.exports.injectHtml(
    'inject-data-errors',
    errors.map(error => error.message),
    html
  )

  return html
}

async function prepareData (key, graphName) {
  if (!(key in injectors)) {
    throw new Error(`Unknown injectData key: ${key}`)
  }

  const cacheKey = JSON.stringify({ key, graphName })

  if (
    cacheKey in lastUpdated &&
    lastUpdated[cacheKey] < new Date().getTime() - injectors[key].cacheDuration
  ) {
    console.log('needs updating', cacheKey)
    needsUpdating.push({ key, graphName, cacheKey })
    updateLater()
  }

  let cachedData = injectors[key]._cachedData[cacheKey]
  if (!cachedData || !cachedData.result) {
    console.log('data not cached for ', key)
    await cacheData(key, graphName, cacheKey)
    console.log('finished caching data for', key)
  }

  const {
    result,
    error,
  } = injectors[key]._cachedData[cacheKey]

  return {
    key,
    content: result,
    error,
  }
}

module.exports.injectHtml = function injectHtml (key, data, html) {
  return html.replace('<title>', `
  <script type="text/inject-data" data-key="${key}">${encodeURIComponent(JSON.stringify(data))}</script>
  <title>
  `)
}

/**
 * The name is used with injectData on the server and getData on the client
 * getData should return a promise that resolves with the data to inject
 * cache is the amount of time in milliseconds that it should catch the data from getData
 *
 * The cached data does not get refreshed until after a request uses it when it is expired.
 * That last request will be using the expired data.
 */
module.exports.registerInjector = function ({ name, cacheDuration, getData }) {
  injectors[name] = {
    cacheDuration,
    getData,
    _cachedData: Object.create(null),
  }
}

let willUpdate = false

function updateLater () {
  if (willUpdate) {
    return
  }
  willUpdate = true

  // process.setTick would run it before the .then in injectData
  setTimeout(update, 10)
}

function update () {
  Promise.all(needsUpdating.map(({ key, graphName, cacheKey }) => {
    return cacheData(key, graphName, cacheKey)
  })).then(() => {
    willUpdate = false
  }).catch(() => {
    willUpdate = false
  })

  needsUpdating = []
}

const cachingPromises = {}

/**
 * Runs the getData function for the key
 *
 * @param {string} key
 * @returns {Promise}
 */
function cacheData (key, graphName, cacheKey) {
  if (cachingPromises[cacheKey]) {
    console.log('has caching promise')
    return cachingPromises[cacheKey]
  }

  if (!(key in injectors)) {
    throw new Error(`uknown injector: ${key}`)
  }

  let promise = injectors[key].getData(graphName)
    .then(cachedData => {
      injectors[key]._cachedData[cacheKey] = {
        result: cachedData,
        error: null,
      }
      lastUpdated[cacheKey] = Date.now()
    }).catch(e => {
      console.log(`Failed updating injectData key ${key} with graph ${graphName}`)
      console.error(e)
      injectors[key]._cachedData[cacheKey] = {
        error: e && e instanceof UserError ? e : new UserError('Internal Error'),
      }
    })
    .finally(() => {
      cachingPromises[cacheKey] = null
    })

  cachingPromises[cacheKey] = promise
  return promise
}
