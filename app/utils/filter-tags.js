import { getData } from './injectData'
import { walkTagTree } from './tree'

let clusters = getData('clusters')

// getData returns an object if it is not able to get
// the data. We want to default to an array instead.
if (Object.keys(clusters).length === 0) {
  clusters = []
}

export const tagTree = clusters

const tags = []
if (clusters) {
  walkTagTree(tagTree, (tag, path) => tags.push({ tag, path }))
}

function findChildIndex (children, key) {
  return children.findIndex(child => child._key === key)
}

// Removes a child from the tagTree
// Used to remove the unwanted paths to a node
// when there are multiple.
function removeChild (path) {
  let previousNode = clusters[findChildIndex(clusters, path[0]._key)]

  for (let i = 1; i < path.length - 1; i++) {
    let index = findChildIndex(previousNode.children, path[i]._key)
    previousNode = previousNode.children[index]
  }

  let index = findChildIndex(previousNode.children, path[path.length - 1]._key)
  previousNode.children.splice(index, 1)
}

export const clusterToPath = tags.reduce((result, { tag, path }) => {
  // There sometimes are multiple paths to a tag
  // The shortest path should be the correct one.
  if (tag._key in result && result[tag._key].length < path.length) {
    removeChild(path)
    return result
  } else if (tag._key in result) {
    removeChild(result[tag._key])
  }

  // Removes child property
  result[tag._key] = path.map(tag => ({ title: tag.title, _key: tag._key }))

  return result
}, {})
