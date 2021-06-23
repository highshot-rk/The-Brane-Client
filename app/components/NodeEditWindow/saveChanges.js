import {
  createLink,
  // addTag,
  updateLink,
} from 'api/link'
import {
  deleteNode,
  updateNode,
  uploadNodePicture,
  removeUpload,
} from 'api/node'
import { clusterToPath } from 'utils/filter-tags'
import { featureEnabled } from 'utils/features'

export default function (originalNode, modified) {
  const nodeId = originalNode._id

  const modifiedDefinition = modified.node.definition
  let promises = []

  const _type = modified.node._type
  const title = modified.node.title

  if (
    _type !== originalNode._type ||
    title !== originalNode.title ||
    modifiedDefinition !== originalNode.definition
  ) {
    promises.push(updateNode(nodeId, { title, _type, definition: modifiedDefinition }))
  }

  if (featureEnabled('uploadImages')) {
    const picture = modified.picture
    if (picture && picture.changed !== false) {
      promises.push(removeUpload(nodeId))
      promises.push(uploadNodePicture(nodeId, picture))
    } else if (!picture) {
      promises.push(removeUpload(nodeId))
    }
  }

  // promises.push(...updateLinks(nodeId, original.links, modified.links, verbs))

  return promises
}

function createClusterPathString (nodes) {
  return nodes.map(node => node.title).join('.')
}
export function tagValueToId (tag) {
  for (const [key, value] of Object.entries(clusterToPath)) {
    if (createClusterPathString(value) === tag.value) {
      return key
    }
  }

  return null
}

function findLink (links, linkId) {
  return links.find(link => link.node._id === linkId)
}
export function diffLinks (originalLinks, modifiedLinks) {
  const added = []
  const removed = []
  const changed = []

  modifiedLinks.forEach(link => {
    const originalLink = findLink(originalLinks, link.node._id)
    if (!originalLink) {
      added.push(link)
    } else if (originalLink.type !== link.type) {
      changed.push(link)
    }
  })

  originalLinks.forEach(link => {
    const modifiedLink = findLink(modifiedLinks, link.node._id)

    if (!modifiedLink) {
      removed.push(link)
    }
  })

  return {
    added,
    removed,
    changed,
  }
}

export function getLinkIds (nodeId, link) {
  if (link.isParent) {
    return {
      parent: link.node._id,
      child: nodeId,
    }
  }

  return {
    parent: nodeId,
    child: link.node._id,
  }
}

export function updateLinks (nodeId, originalLinks, modifiedLinks) {
  const {
    added,
    removed,
    changed,
  } = diffLinks(originalLinks, modifiedLinks)
  const promises = []

  if (added.length) {
    console.warn('Added links should already have been created')
  }

  if (changed.length > 0) {
    console.log('updating links', changed)
    promises.push(...changed.map(link => {
      const {
        parent,
      } = getLinkIds(nodeId, link)

      return updateLink({ topicKey: parent, linkKey: link.linkId, linkType: link.type })
    }))
  }

  if (removed.length > 0) {
    console.warn('Deleted links should have already been removed')
  }

  return promises
}

export function mergeNodes ({
  targetKey,
  targetLinks,
  nodes,
}) {
  const promises = []
  const existingLinks = targetLinks.map(link => {
    return `${link.category._key}-${link.category.isParent}`
  })

  nodes.forEach(({ links }) => {
    links.forEach(link => {
      if (existingLinks.indexOf(`${link.category._key}-${link.isParent}`) === -1) {
        console.log('new link')
        promises.push(
          createLink(
            link.isParent ? link.category._key : targetKey,
            link.isParent ? targetKey : link.category._key,
            link.verb
          )
        )
      } else {
        console.log('preexisting link')
      }
    })
  })

  return promises.concat(nodes.map(node => {
    return deleteNode(node.node.category._key)
  }))
}
