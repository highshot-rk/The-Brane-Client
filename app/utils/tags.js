import {
  clusterToPath,
  tagTree,
} from './filter-tags'
import {
  uniqBy,
  throttle,
} from 'lodash-es'
import { ensureKey } from 'api/utils'

const throttledWarn = throttle(console.warn, 1000)

const clusterToClusterType = 'hasSubclass'
const clusterTypes = ['cluster', 'property', 'journal']
const categorizingLinkTypes = ['has', 'categorizes', 'contains', 'hasInstance', clusterToClusterType]
const normalLinks = ['link', 'publishes', 'authors', 'references', 'encompasses']

export function isCluster (topic) {
  return clusterTypes.includes(topic._type)
}
export function isCategorizingLink (link) {
  return categorizingLinkTypes.includes(link._type)
}
export function getClusterType () {
  return clusterTypes[0]
}

export let linkTypes = [...categorizingLinkTypes, ...normalLinks]

export const upDownText = {
  'categorizes': { up: 'is a kind of', down: 'contains' },
  'category': { up: 'is categorized as', down: 'categorizes' },
  'property': { up: 'is a property of', down: 'has' },
  'contains': { up: 'is contained by', down: 'contains' },
  'hasSubclass': { down: 'has subclass', up: 'is a type of' },
  'hasInstance': { down: 'has instance', up: 'is a' },
  'encompasses': { up: 'is encompassed within', down: 'encompasses' },
}

export const nameUpDownText = {
  'is related to': { up: 'is related to', down: 'is related to' },
  'makes_01': { up: 'is made by', down: 'makes' },
  'makes_02': { up: 'is made of', down: 'makes' },
  'outputs': { up: 'is an output of', down: 'outputs' },
  'inputs': { up: 'is an input of', down: 'inputs' },
  'changes': { up: 'is changed by', down: 'changes' },
  'fixes': { up: 'is fixed by', down: 'fixes' },
  'arranges': { up: 'is arranged by', down: 'arranges' },
  'produces': {
    up: 'is produced by', down: 'produces' },
  'becomes': { up: 'comes from', down: 'becomes' },
  'uses': { up: 'is used by', down: 'uses' },
  'uses_01': { up: 'is used by', down: 'uses' },
  'uses_02': { up: 'is used for', down: 'uses' },
  'contains_01': { up: 'is contained in', down: 'contains' },
  'stores': { up: 'is stored in', down: 'stores' },
  'manufactures': { up: 'is manufactured', down: 'manufactures' },
  'treats': { up: 'is treated by', down: 'treats' },
  'processes_01': { up: 'is processed by', down: 'processes' },
  'processes_02': { up: 'is processed for', down: 'processes' },
  'performs': { up: 'is performed by', down: 'performs' },
  'provides': { up: 'is provided by', down: 'provides' },
  'conducts': { up: 'is conducted by', down: 'conducts' },
  'develops': { up: 'is developed by', down: 'develops' },
  'prevents': { up: 'is prevented by', down: 'prevents' },
  'designs': { up: 'is designed by', down: 'designs ' },
  'measures': { up: 'is measured by', down: 'measures' },
  'correlates': { up: 'correlates with', down: 'correlates with' },
  'interacts': { up: 'interacts with', down: 'interacts with' },
  'causes': { up: 'is caused by', down: 'causes' },
  'studies': { up: 'is studied by', down: 'studies' },
  'explains': { up: 'is explained by', down: 'explains' },
  'researches': { up: 'is researched by', down: 'researches' },
  'publishes': { up: 'is published by', down: 'publishes' },
  'mentions_01': { up: 'is mentioned by', down: 'mentions' },
  'mentions_02': { up: 'is mentioned in', down: 'mentions' },
  'authors': { up: 'is authored by', down: 'authors' },
  'reprint': { up: 'has for reprint author', down: 'is the reprint author of' },
  'specializes in_01': { up: 'is the specialty of', down: 'specializes in' },
  'specializes in_02': { up: 'is specialized in by', down: 'specializes in' },
  'discovers': { up: 'is discovered by', down: 'discovers' },
  'presents': { up: 'is presented in ', down: 'presents' },
  'speaks': {
    up: 'is the language of', down: 'speaks' },
  'is written in': { up: 'is the language of', down: 'is written in ' },
  'is located in': { up: 'is the location of', down: 'is located in ' },
  'employs': { up: 'is employed by', down: 'employs' },
  'knows': { up: 'knows', down: 'knows' },
  'is a teammate of': { up: 'is a teammate of', down: 'is a teammate of' },
  'is a colleague of': { up: 'undefined', down: 'is a colleague of' },
  'collaborates with': { up: 'collaborates with', down: 'collaborates with' },
  'competes with': { up: 'competes with', down: 'competes with' },
  'manages': { up: 'is managed by', down: 'manages' },
  'supervises': { up: 'is supervised by', down: 'supervises' },
  'influences': { up: 'is influenced by', down: 'influences' },
  'councels': { up: 'is advised by', down: 'advises' },
  'is affiliated with': { up: 'is affiliated with', down: 'is affiliated with' },
  'supplies': { up: 'is supplied by', down: 'supplies' },
  'buys': { up: 'is buying from', down: 'buys' },
  'owns': { up: 'is owned by', down: 'owns' },
  'leads': { up: 'is led by', down: 'leads' },
  'controls': { up: 'is controlled by', down: 'controls' },
  'initiates': { up: 'is initiated by', down: 'initiates' },
  'starts': { up: 'is started by', down: 'starts' },
  'possesses': { up: 'is possessed by', down: 'possesses' },
  'is responsible for': { up: 'is the responsibility of', down: 'is responsible for' },
  'acquired': { up: 'was acquired by', down: 'acquired' },
  'groups': { up: 'is grouped as', down: 'groups' },
  'contains_02': { up: 'is a part of', down: 'contains' },
  'includes': { up: 'is a member of', down: 'includes' },
  'believes in': {
    up: 'is believed in by', down: 'believes in' },
  'opposes': {
    up: 'is opposed by', down: 'opposes' },
}

export function getUpDownText (linkType, name) {
  if (typeof name === 'undefined') {
    throttledWarn('Link name was not provided when getting down text')
  }
  if (linkType in upDownText) {
    return upDownText[linkType]
  }

  if (linkType === 'link' && (name in nameUpDownText)) {
    return nameUpDownText[name]
  }

  if (linkType !== 'link' || name) {
    throttledWarn(`No upDown text for linkType ${linkType} and name ${name}`)
  }

  return {
    up: 'is related to',
    down: 'is related to',
  }
}

export function getLinkTypes () {
  return Object.keys(upDownText)
}

/**
 * Returns a copy of the cluster's path
 */
export function clusterKeyToTagPath (key) {
  return (clusterToPath[key] || []).slice()
}
/**
 * returns the tag item found
 * @param {Array} tags the tagsTree to loop into
 * @param {strin} key tag key to find
 */
export function findByKey (tags, key) {
  return tags.find(tag => tag._key === key)
}
/**
 * returns a tree representation for a given label
 * @param {string} key tag key
 */
export function keyToTree (key) {
  const path = clusterKeyToTagPath(key)
  if (path === undefined || path.length === 0) {
    return null
  } else {
    const first = findByKey(tagTree, path.shift()._key)
    return path.reduce((parent, pathItem) => {
      return findByKey(parent.children, pathItem._key)
    }, first)
  }
}

/**
 * Finds all unique tags at the bottom level
 */
export function allUniqueTags (tags) {
  return uniqBy(tags.map(tag => tag[tag.length - 1]), '_key')
}

export function tagPathsEqual (path1, path2) {
  return path1.length === path2.length && tagPathsInclude(path1, path2)
}

export function getTagTitle (tagKey) {
  let tree = clusterKeyToTagPath(tagKey)
  if (tree && tree.length > 0) {
    return tree[tree.length - 1].title
  }
  return undefined
}

/**
 * Checks if a path includes another path
 * @param {NodeFilter} path1 - Path that should be included
 * @param {NodeFilter} path2 - Path to check
 */
export function tagPathsInclude (path1, path2) {
  return path1.every((pathItem, index) => path2[index] && path2[index]._key === pathItem._key)
}

export function findTagFilterIndex (tagFilters, path, exact = false) {
  const compare = exact ? tagPathsEqual : tagPathsInclude

  return tagFilters.findIndex(tagFilter =>
    compare(path, tagFilter)
  )
}

export function createTagList (node, parents = []) {
  node = { ...node, _key: ensureKey(node._key || node._id) }
  const tagList = parents
    .filter(parent => parent !== null)
    .filter(isCluster)
    .map(parent => ({ ...parent, _key: ensureKey(parent._key || parent._id) }))
    .map(({ _key }) => clusterToPath[_key])

  if (isCluster(node)) {
    tagList.push(clusterToPath[node._key || node._id])
  }

  if (tagList.filter(list => list === undefined).length > 0) {
    throttledWarn('undefined tag list', node, parents, tagList)
  }
  return tagList.filter(list => list !== undefined)
}
