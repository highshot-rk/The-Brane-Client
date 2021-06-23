import api, { getContentURL } from '.'
import {
  uploadPicture, ensureKey, ensureId,
} from './utils'
import {
  removeStaleDocuments,
} from './cache'
import {
  flatten,
} from 'lodash-es'

import {
  createLink as createLinkFactory,
} from 'utils/factories'

export async function getLink (parentKey, childKey) {
  parentKey = ensureKey(parentKey)
  const childId = ensureId(childKey, 'topics')

  const links = await getLinks(parentKey, { relativeId: childId })
  return links[0]
}

export async function getLinkById (parentKey, linkKey) {
  parentKey = ensureKey(parentKey)
  linkKey = ensureKey(linkKey)

  const result = await api.get(`topics/${parentKey}/links/${linkKey}`, {
    cache: {
      keys: [parentKey, linkKey],
    },
  })

  return createLinkFactory(result.data)
}

export async function getLinks (nodeKey, { embed = false, direction = 'all', excludeTypes = 'has', embedGivenNode = true, embedTags = true, relativeId }) {
  const props = [
    `direction=${direction}`,
    `excludeTypes=${excludeTypes}`,
    `embedGivenNode=${embedGivenNode}`,
    `embedTags=${embedTags}`,
  ]
  if (embed) {
    props.push(`embed=${embed}`)
  }
  if (relativeId) {
    props.push(`relativeId=${relativeId}`)
  }
  const result = await api.get(`topics/${nodeKey}/links?${props.join('&')}`)

  // There is a separate object for each link type
  return flatten(Object.values(result.data._embedded))
}

export async function getLinkImage (linkKey) {
  linkKey = ensureKey(linkKey)

  const contentURL = getContentURL('image', linkKey)
  const response = await api.get(contentURL, {
    cache: {
      keys: [linkKey],
    },
  })

  return response && response.status === 200 ? {
    url: contentURL,
  } : null
}

export function createLink ({ parentKey, childKey, linkType = 'link', definition = '' }) {
  parentKey = ensureKey(parentKey)
  childKey = ensureKey(childKey)

  removeStaleDocuments([parentKey, childKey])

  return api.post(`topics/${parentKey}/links`, {
    _from: `topics/${parentKey}`,
    _to: `topics/${childKey}`,
    definition,
    _type: linkType,
  })
}

export function updateLink ({ topicKey, linkKey, linkType, definition }) {
  return api.patch(`topics/${topicKey}/links/${linkKey}`, {
    _type: linkType,
    definition: definition,
  })
}

export function deleteLink (parentKey, linkKey) {
  parentKey = ensureKey(parentKey)
  linkKey = ensureKey(linkKey)

  removeStaleDocuments([parentKey, linkKey])
  return api.delete(`topics/${parentKey}/links/${linkKey}`)
}

export function addTag (nodeKey, tagKey) {
  removeStaleDocuments([nodeKey, tagKey])

  return createLink(tagKey, nodeKey, ['contains', 'is a kind of'])
}

export function removeTag (nodeKey, tagKey) {
  removeStaleDocuments([nodeKey, tagKey])

  return deleteLink(tagKey, nodeKey)
}

export function updateImage (linkKey, picture) {
  removeStaleDocuments(linkKey)

  return uploadPicture(`relations/${linkKey}`, picture)
}
