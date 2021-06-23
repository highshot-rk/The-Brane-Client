import { ensureId, ensureKey } from 'api/utils'
import { clusterKeyToTagPath } from './tags'

export function createNode ({
  _id,
  id,
  _key,
  // Different versions of the api have used different property names
  // and different parts of the front end use the different property names
  title,
  name,
  t,
  definition = '',
  _type = 'topic',
  count = 0,
  childCount = 0,
  parentCount = 0,
  tagList = [],
  tags = [],

  additionalProperties,
  ...properties
}) {
  if (!(_id || _key || id)) {
    throw new Error('Node is missing _id and _key property. At least one must be provided')
  }
  if (!title && !name && !t) {
    console.warn('Node is missing title')
  }

  if (name || t) {
    console.warn('Using name or t properties for nodes is no longer supported')
  }

  const node = {
    _id: ensureId(_id || _key || id, 'topics'),
    title: title || name || t,
    definition,
    _type,
    childCount: childCount || count,
    parentCount: parentCount,
    // This is the type specific properties, like the volume number or cited references
    additionalProperties: {
      ...additionalProperties,
      ...properties,
    },
  }

  return {
    ...node,
    tagList: [...tagList, ...tags.map(tag => clusterKeyToTagPath(ensureKey(tag))).filter(tag => !!tag && tag.length > 0)],
  }
}

export function createTagList (tags) {
  return tags.map(tag => clusterKeyToTagPath(ensureKey(tag)))
    // Sometimes a parent cluster that would normally categorize a topic
    // is not a tag because the parent cluster is either not connected to
    // the root node, or does not have a path to the root node with only
    // categorizing links
    .filter(tagPath => tagPath.length > 0)
}

export function createProperty ({
  title,
  cluster,
  _id,
  id,
  value,
}) {
  if (value && value._type === 'date') {
    value = new Date(value.value)
  }

  return {
    _id: ensureId(_id || id, 'topics'),
    title,
    value,
    cluster,
  }
}

export function createStats ({
  id,
  max,
  mean,
  min,
  standardDeviation,
  sum,
  values,
  title,
  topicId,
}) {
  return {
    propertyTitle: title,
    propertyId: id,
    topicId: topicId,
    max,
    mean,
    min,
    standardDeviation,
    sum,
    n: values.length,
    values: values.map(value => typeof value === 'object' ? value.value : value),
  }
}

export function createRelative (node, {
  _type = 'link',
  _id,
  _from,
  name,
}) {
  const fromId = typeof _from === 'string' ? _from : _from._id
  const linkDirection = ensureKey(fromId) === ensureKey(node._id) ? 'parent' : 'child'

  return {
    linkType: _type,
    linkName: name,
    linkId: _id,
    linkDirection,
    ...createNode(node),
  }
}

export function createLink ({
  _id,
  name,
  description,
  _type = 'link',
  _from,
  _to,
} = {}) {
  return {
    _id,
    name,
    description,
    _type,
    _from,
    _to,
  }
}

export function createEditableLink ({
  text = '',
  isParent = true,
  type = 'link',
  node = null,
  linkId = null,
} = {}) {
  return {
    text,
    isParent,
    type,
    node,
    linkId,
  }
}
