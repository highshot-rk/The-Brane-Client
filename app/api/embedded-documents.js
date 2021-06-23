import {
  flatten,
  uniq,
} from 'lodash-es'
import {
  ensureKey,
} from './utils'

/**
 * Finds all of the ids or keys referenced in the response
 * @param {*} data
 */
export function findEmbedded (data) {
  const result = []

  if (!data || typeof data === 'string') {
    // This happens when the clusters is an array of cluster titles
    // TODO: check if this is still needed after latest api changes
    return []
  }

  if (data instanceof Array) {
    result.push(...data.map(findEmbedded))
  }

  [
    'children',
    'clusters',
    'parents',
  ].forEach(key => {
    if (key in data && data[key].length > 0) {
      result.push(...data[key].map(findEmbedded))
    }
  })

  if (data.node) {
    // TODO: once all api's consistently provide the _id in the _id field,
    // switch to using the id instead of key
    result.push(ensureKey(data.node._key || data.node._id))
  }

  if (data._id || data._key) {
    // TODO: once all api's consistently provide the _id in the _id field,
    // switch to using the id instead of key
    result.push(ensureKey(data._key || data._id))
  }

  return uniq(flatten(result))
}
