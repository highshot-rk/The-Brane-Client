import api from './'
import { removeStaleDocuments } from './cache'

export function createPath (path, title) {
  return api.post('paths', {
    title: title || 'Untitled',
    data: JSON.stringify(path),
  })
}

export function updatePath (pathKey, path, title) {
  removeStaleDocuments(pathKey)
  return api.put(`paths/${pathKey}`, {
    title: title || 'Untitled',
    data: JSON.stringify(path),
  })
}

export function getPaths () {
  return api.get('paths', {
    // The paths are constantly being updated
    // and this endpoint can list paths that were
    // created or updated on other devices
    // so there is no good way to know when
    // it becomes stale
    braneCacheTTL: 0,
  })
}

export function getPath (pathKey) {
  return api.get(`paths/${pathKey}`, {
    braneCacheKeys: [pathKey],
  })
}
