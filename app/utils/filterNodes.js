import {
  throttle,
  pickBy,
  omitBy,
} from 'lodash-es'

const throttledWarn = throttle(console.warn, 100000)

function filterTagSet (tagPath, tagFilters) {
  return tagFilters.find(tagFilter => {
    const last = tagFilter[tagFilter.length - 1]._key

    return tagPath.find(tag => tag._key === last)
  })
}

function createFilter (tagFilters) {
  return function (node) {
    if (node.tagList) {
      return node.tagList.some(tagPath => filterTagSet(tagPath, tagFilters))
    } else if (node.path) {
      throttledWarn('Node being filtered has no tagList. Falling back to path, which is no longer accurate.', node)

      return filterTagSet(node.path.slice(1), tagFilters)
    } else {
      throttledWarn('Node being filtered has no tagList or path', node)

      return false
    }
  }
}

/**
 * Filters nodes by family, group, and type
 * @export
 * @param {Object} nodesObject each value should be a node object
 */
export function filterNodeObject (nodesObject, tagFilters) {
  if (tagFilters.length === 0) {
    // When there are no tagFilters, filterTagSet filters out everything
    return nodesObject
  }

  return pickBy(nodesObject, createFilter(tagFilters))
}

/**
 * Filters nodes by family, group, and type
 * @export
 * @param {Nodes[]} nodesArray
 * @param {TagFilters[]} tagFilters
 * @returns
 */
export function filterNodeArray (nodesArray, tagFilters) {
  if (tagFilters.length === 0) {
    return nodesArray
  }

  return nodesArray.filter(createFilter(tagFilters))
}

/**
 * Inverted filterNodeObject()
 * @param {Nodes[]} nodesObject
 * @param {TagFilters[]} tagFilters
 */
export function excludeFilter (nodesObject, tagFilters) {
  return omitBy(nodesObject, createFilter(tagFilters))
}

function filterByDirection (relatives, direction) {
  return Object.entries(relatives).reduce((result, [key, relative]) => {
    if (relative.linkDirection === direction) {
      result[key] = relative
    }

    return result
  }, {})
}

export function filterShowOnOrbit (relatives, showOnOrbit) {
  switch (showOnOrbit) {
    case 'children':
      return filterByDirection(relatives, 'child')

    case 'parents':
      return filterByDirection(relatives, 'parent')

    case 'all':
      return relatives

    default:
      return relatives
  }
}
