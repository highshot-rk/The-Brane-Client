const { injectHtml } = require('./injectData')

const cache = {}

const UPDATE_TIMEOUT = 43200000 // 12 Hours

const updating = []

function updateLater (load, key) {
  if (updating.indexOf(key) > -1) {
    return
  }

  updating.push(key)

  setTimeout(async () => {
    try {
      const result = await load()
      cache[key] = result
    } catch (e) {
      console.log('failed updating cache', e.message)
    }

    updating.splice(updating.indexOf(key), 1)
  }, UPDATE_TIMEOUT * (Math.random() + 0.5))
}

let initialLoad = {}

module.exports = async function preacheAPI (endpoints, html) {
  let results = []

  const promises = endpoints.map(async ({ path, load, body, cache: isCache }) => {
    let result
    let key = path
    if (body) {
      key = JSON.stringify({ path, body })
    }

    if (isCache && key in cache) {
      updateLater(load, key)

      result = cache[key]
    } else {
      try {
        const promise = initialLoad[key] || load()
        initialLoad[key] = promise
        result = await promise
      } catch (e) {
        initialLoad[key] = null
        console.log('failed getting cache result', e.message)
        return
      }

      initialLoad[key] = null
      if (isCache) {
        cache[key] = result
      }
    }

    results.push({ key, result: result && result.data ? result.data : [] })
  })

  await Promise.race([
    Promise.all(promises),
    new Promise(resolve => setTimeout(resolve, 1000 * 10)),
  ])

  const dataToInject = results
    .filter(result => result)
    .reduce((combined, { key, result }) => {
      combined[key] = result

      return combined
    }, {})
  if (Object.keys(dataToInject).length > 0) {
    console.log(`Injecting ${Object.keys(dataToInject).length}/${endpoints.length} cached endpoints`)
  }
  return injectHtml('precache-api', dataToInject, html)
}
