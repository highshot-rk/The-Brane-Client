import Dexie from 'dexie'
import { featureEnabled } from 'utils/features'

let indexedDB = window.indexedDB
if (process.env.NODE_ENV === 'test') {
  indexedDB = require('fake-indexeddb')
}

// TODO: increase once it correctly removes stale items after editing or creating an entity
const DEFAULT_TTL = 0

// Indexdb does not allow searching for true/false values
const TRUE = 0
const FALSE = 1

const db = new Dexie('ApiCache', {
  indexedDB,
})
db.version(1).stores({
  responses: `path,data,expires,*embeddedDocuments,eagerlyStale`,
})
db.open()

export async function getResponse (path) {
  if (!featureEnabled('indexedDbCache')) {
    return null
  }

  try {
    const response = await db.responses.get(path)

    if (response && response.expires > Date.now()) {
      return response
    }

    return null
  } catch (e) {
    console.log('error retreiving cached response', e)
    return null
  }
}

/**
 *
 * @param {Object} options
 * @param {String} options.path route of cached request
 * @param {Object} options.data content of response
 * @param {Number} options.ttl how long the response should be cached, in milliseconds
 * @param {eagerlyStale} options.bool if the item should be removed from cache whenever any data is
 * modified through the api
 */
export function cacheResponse ({
  path,
  data,
  embeddedDocuments,
  ttl = DEFAULT_TTL,
  eagerlyStale = false,
}) {
  return db.responses.put({
    path,
    data,
    embeddedDocuments,
    expires: Date.now() + ttl,
    eagerlyStale: eagerlyStale ? TRUE : FALSE,
  }).catch(console.log)
}

export function removeStaleDocuments (documentKeys) {
  if (typeof documentKeys === 'string') {
    documentKeys = [documentKeys]
  }

  return Promise.all([
    ...documentKeys.map(key => db.responses.where('embeddedDocuments').equals(key).delete()),
    db.responses.where({ eagerlyStale: TRUE }).delete(),
  ]).catch(console.log)
}

// TODO: handle indexdb close to reaching storage limit
setInterval(() => {
  db.responses.where('expires').below(Date.now()).delete().catch(err => console.error('unable to remove old responses', err))
}, 1000 * 60)

export default db
