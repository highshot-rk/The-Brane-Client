import api, { getContentURL } from './'
import {
  uploadPicture,
  ensureKey,
  ensureId,
} from './utils'
import {
  removeStaleDocuments,
} from './cache'
import { getLinks } from './link'
import { createNode as nodeFactory, createRelative, createProperty, createStats, createTagList } from 'utils/factories'
import {
  flatten,
} from 'lodash-es'
import { getTagTitle } from 'utils/tags'

export async function getNode (key) {
  key = ensureKey(key)
  const {
    data,
  } = await api.get(`topics/${ensureKey(key)}`)
  return nodeFactory(data)
}

export async function getTags (nodeKey) {
  nodeKey = ensureKey(nodeKey)
  const { data } = await api.get(`topics/${nodeKey}/tags`)
  return createTagList(data).filter(tagList => tagList.length > 0)
}

export async function getRelatives (key, direction, { embedTags = true } = {}) {
  key = ensureKey(key)
  const links = await getLinks(key, { embed: true, direction, embedGivenNode: false, embedTags })
  return links.map((link) => {
    const fromGivenNode = typeof link._from === 'string'
    if (fromGivenNode) {
      return createRelative(link._to, link)
    } else {
      return createRelative(link._from, link)
    }
  })
}

export async function getProperties (key) {
  key = ensureKey(key)

  const {
    data,
  } = await api.get(`topics/${key}?type=property`)
  return flatten(Object.values(data._embedded)).map(createProperty)
}

export async function getVennProperties (relatedKeys) {
  relatedKeys = relatedKeys.map(key => ensureKey(key))

  const promises = relatedKeys.map(key => {
    return getProperties(key)
  })
  const result = await Promise.all(promises)

  return result.reduce((byTopic, properties, index) => {
    const topicId = ensureId(relatedKeys[index], 'topics')
    byTopic[topicId] = properties

    return byTopic
  }, {})
}

export async function getRelatedProperties (key) {
  key = ensureKey(key)
  const [
    { data: relatedProperties },
    { data: parentProperties },
    { data: withClusters },
  ] = await Promise.all([
    api.get(`topics/${key}/properties`),
    getProperties(key),
    api.get(`topics/${key}/filterAPI?embedTopics=false`),
  ])

  if (relatedProperties && !(key in relatedProperties)) {
    relatedProperties[key] = parentProperties || []
  }
  let defaultCluster = getTagTitle(key) || undefined

  const clusters = Object.values(withClusters[ensureId(key, 'topics')]).reduce((result, item) => {
    item.topic.forEach(topic => {
      if (!(topic._id in result)) {
        result[topic._id] = []
      }

      result[topic._id].push(item.clusterName || defaultCluster)
    })

    return result
  }, {})

  Object.keys(relatedProperties).forEach(nodeId => {
    let propertyClusters = clusters[nodeId] || ['Other']

    // We should support more clusters per node, but
    // The api currently only gives us one cluster per node
    // and we don't handle when there is more
    if (propertyClusters.length > 1) {
      console.warn('There should only be one cluster per node')
    }

    relatedProperties[nodeId] = relatedProperties[nodeId].map(item => {
      return createProperty({
        ...item,
        cluster: propertyClusters[0],
      })
    })
  })
  return relatedProperties
}

export async function getPropertyStatistics (key, topicIds) {
  key = ensureKey(key)

  if (topicIds) {
    topicIds = topicIds.map(id => ensureId(id, 'topics'))
  }

  const params = [
    'type=property',
    'stats=true',
    topicIds ? `topicKeys=${topicIds}` : '',
  ].join('&')
  const {
    data,
  } = await api.get(`topics/${key}?${params}`)

  return data.map(stats => createStats({ ...stats, topicId: key }))
}

export async function getPropertyClusters (key) {
  key = ensureKey(key)

  const {
    data,
  } = await api.get(`topics/${key}/filterAPI?embedTopics=false`)

  return data
}

export async function getNodeImage (key) {
  key = ensureKey(key)

  const contentURL = getContentURL('image', key)
  const response = await api.get(contentURL, {
    cache: {
      keys: [key],
    },
  })

  return response && response.status === 200 ? {
    url: contentURL,
  } : null
}

export function loadCommonNodes ([key1, key2]) {
  return api.get(`nodes/${key1}/common-neighbors-with/${key2}`, {
    cache: {
      keys: [key1, key2],
    },
  })
}

export function searchNodes (query, { sortBy = 'count', limit = 50, from = 0 } = {}) {
  const params = [
    `q=${query}`,
    sortBy ? `sortBy=${sortBy}` : null,
    limit ? `limit=${limit}` : null,
    typeof from !== 'undefined' ? `from=${from}` : null,
  ].filter(param => param).join('&')
  const result = {
    total: null,
    results: [],
  }

  return api.get(`topics?${params}`, {
    eagerlyStale: true,
  }).then(({ data }) => {
    const {
      _embedded = {},
      metadata,
    } = data

    result.results = flatten(Object.values(_embedded)).map(nodeFactory)

    if (metadata) {
      result.total = metadata.total

      if (metadata.aggregations && metadata.aggregations.facetTags) {
        result.tagCounts = metadata.aggregations.facetTags
          .reduce((result, { key, childCount }) => {
            result[key] = childCount
            return result
          }, {})
      }
    } else {
      result.total = result.results.length
    }

    return result
  })
}

export async function getVennSuggestions (nodeKey, operator = 'intersection') {
  const result = await api.get(`topics/${nodeKey}/${operator}/venn-suggestions`, {
    cache: {
      // TODO: it might be possible to simply add nodeKey to the `keys` array
      // instead of making it eagerlyStale
      eagerlyStale: true,
    },
  })

  if (result.data._embedded) {
    return flatten(Object.values(result.data._embedded)).map(nodeFactory)
  }

  return []
}

export async function getVennSubdescription (nodeKey, operator) {
  const result = await api.get(`topics/${nodeKey}/${operator}/venn-suggestions`, {
    catch: {
      eagerlyStale: true,
    },
  })
  if (result.data._embedded) {
    return flatten(Object.values(result.data._embedded)).map(nodeFactory)
  }
  return []
}

export async function getVennResults (queries) {
  queries = queries.map(query => {
    return {
      ...query,
      id: ensureKey(query.id),
    }
  })
  const result = await api.post(`topics/venn`, queries)
  return result.data.map(nodeFactory)
}

export function getNodePublications (nodeTitle) {
  return api.get(`publications?any=${nodeTitle}`, {
    cache: {
      eagerlyStale: true,
    },
  })
}

export async function checkTitleUnique (title) {
  if (title.trim().length === 0) {
    return true
  }

  const { results } = await searchNodes(title)

  title = title.toLowerCase()

  return !results.find(result => result.title.toLowerCase() === title)
}

export async function createNode ({
  title,
  definition,
  _type,
}) {
  const result = await api.post('topics', {
    title,
    definition,
    _type,
  })

  return nodeFactory(result.data)
}

export function uploadNodePicture (nodeKey, picture) {
  removeStaleDocuments(ensureKey(nodeKey))

  uploadPicture(getContentURL('image', nodeKey), picture)
}

export function removeUpload (nodeKey) {
  removeStaleDocuments(ensureKey(nodeKey))

  return api.delete(getContentURL('image', nodeKey))
}

export function updateNode (nodeKey, { title, _type, definition }) {
  removeStaleDocuments(ensureKey(nodeKey))

  return api.patch(`topics/${ensureKey(nodeKey)}`, { title, _type, definition })
}

export function deleteNode (nodeKey) {
  removeStaleDocuments(ensureKey(nodeKey))

  return api.delete(`topics/${ensureKey(nodeKey)}`)
}

export async function filterOneNode (keys) {
  const { data } = await api.get(`topics/${keys}/filterAPI`)
  return data
}
