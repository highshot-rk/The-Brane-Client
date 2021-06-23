import {
  ActiveProperty,
  FocusedNodeProperties,
  Property,
} from 'containers/PropertySidebar/types'
import { nodeOriginallyFrom, findOutgoing } from 'containers/FixedPath/layout'
import {
  isCluster,
} from 'utils/tags'
import { SORT_DESCENDING, SORT_ASCENDING } from './constants'
import { VENN_ID } from '../constants'
import { SourceNodeMap, Node, Quadrant, SourceNode, BranchDetails, BranchEntry, NodeFrom, RelativeMap, Relative, ReorderedRelative } from 'containers/FixedPath/types'
export const MAX_VISIBLE_RELATIVES = 16
export const MAX_VISIBLE_RELATIVES_ORBIT_LOCKED = 14
export const ANGLES: Quadrant[] = [45, 135, 225, 315]

/**
 * Finds nodes directly between the two nodes
 *
 * @export
 * @param {any} startNode
 * @param {any} stopNode
 * @param {any} nodes
 * @returns {NodeId[]}
 */
export function nodesDirectlyBetween (startNode: Node, stopNode: Node, nodes: SourceNodeMap) {
  let result = []
  let fromId = stopNode.originallyFrom
  if (fromId === undefined) {
    // stopNode is the fixed path's first node. Search path in the opposite direction
    [startNode, stopNode] = [stopNode, startNode]
    fromId = stopNode.originallyFrom
  }
  let found = false

  result.push(stopNode._id)
  while (!found) {
    if (fromId === startNode._id) {
      found = true
    }
    result.push(fromId)
    fromId = nodes[fromId].originallyFrom
  }
  return result
}

/**
 * Finds the available quadrant closest to the angle
 * @param {Number} angle - angle of node from parent
 * @param {Number[]} availableQuadrants quadrants around parent that are unoccupied
 * @returns {Number} angle of quadrant that is closest, or -1 if none are found
 */
export function closestQuadrant (angle: Quadrant | number, availableQuadrants: Quadrant[]): Quadrant | null {
  if (availableQuadrants.length === 0) {
    return null
  }

  // When the closest quadrant is 45 deg, but there is a quadrant between 45 and the angle,
  // this will make sure it picks the closest quadrant and not the closest number
  // This also works when the angle is small, and the closest quadrant is at 315 deg
  if (availableQuadrants.indexOf(45) > -1) {
    // TODO: remove type assertion
    availableQuadrants = availableQuadrants.concat([(360 + 45) as Quadrant])
  }
  if (availableQuadrants.indexOf(315) > -1) {
    availableQuadrants = availableQuadrants.concat([-45])
  }

  let result = availableQuadrants.reduce((answer, current) => {
    return Math.abs(current - angle) < (Math.abs(answer - angle)) ? current : answer
  })
  if (result === 360 + 45) {
    result = 45
  } else if (result === -45) {
    result = 315
  }
  return result
}

/**
 * Calculates length of branch, and locates the newest expanded/restored node. If there is a fork, it adds the length of both
 * branches.
 *
 * @export
 * @param {any} parent
 * @param {any} nodes
 * @returns {Number} Object.length Length of branch
 * @returns {Number} Object.newestIndex Expand index of newest expanded/restored node
 */
export function branchDetails (parent: SourceNode, nodes: SourceNodeMap) {
  let total = parent.outgoing.length
  let _newestIndex = 0

  // The first node doesn't have parent.originallyFrom defined
  if (nodes[parent.originallyFrom]) {
    _newestIndex = nodes[parent.originallyFrom].relatives[parent._id].expanded
  }

  for (let i = 0; i < parent.outgoing.length; i++) {
    let outgoingId = parent.outgoing[i]._id

    if (outgoingId === parent.originallyFrom) {
      // Prevents infinite loops. This can happen when a venn-diagram search results
      // parent is expanded and has a child for the search results.
      continue
    }

    let {
      length,
      newestIndex,
    } = branchDetails(nodes[parent.outgoing[i]._id], nodes)
    total += length
    newestIndex = newestIndex > _newestIndex ? newestIndex : _newestIndex
  }
  return {
    length: total,
    newestIndex: _newestIndex,
  }
}

export function longestBranch (parents: SourceNode[], nodes: SourceNodeMap) {
  let results: BranchDetails[] = []

  if (parents.length === 0) {
    return null
  }

  parents.forEach((parent) => {
    let length = branchDetails(parent, nodes).length
    results.push({
      length,
      _id: parent._id,
    })
  })
  results.sort((a, b) => {
    if (a.length > b.length) {
      return -1
    }
    if (b.length > a.length) {
      return 1
    }
    return 0
  })
  return results[0]._id
}

/**
 * Finds longest branch (mainBranchNodes) from a node and
 * other branches off of it (branchOffs)
 * @param {*} node
 * @param {*} nodes
 * @return {Object} has mainBranchNodes and branchOffs properties
 */
export function expandedRelatives (node: SourceNode, nodes: SourceNodeMap) {
  let mainBranchNodes: BranchEntry[] = []
  let branchOffs: BranchEntry[] = []
  let longestOutgoing = longestBranch(
    node.outgoing.map(outgoing => nodes[outgoing._id]),
    nodes
  )

  node.outgoing.forEach(outgoing => {
    if (outgoing._id === VENN_ID) {
      return
    }
    if (outgoing._id === longestOutgoing) {
      let childBranch = expandedRelatives(nodes[outgoing._id], nodes)
      mainBranchNodes.push({
        _id: outgoing._id,
        title: outgoing.title,
        branchOffs: childBranch.branchOffs,
      })
      mainBranchNodes.push(...childBranch.mainBranchNodes)
      return
    }
 
    branchOffs.push({
      _id: outgoing._id,
      title: outgoing.title,
      branchOut: true,
    })
  })

  return {
    mainBranchNodes,
    branchOffs,
  }
}

/**
 * Returns node that has the id
 *
 * @param {Nodes[]} nodes array of nodes to search
 * @param {String} id
 * @returns {Node}
 */
export function findNodeById (nodes: any[], id: string) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]._id === id) {
      return nodes[i]
    }
  }
}

/**
 * Calls callback for each expanded node in branch
 * @param {Object} options
 * @param {String} options.startId
 * @param {Object} option.nodes
 * @param {Boolean} option.skipCollapsed - Optional. Disables walking collapsed branches
 * @param {Function} cb - called for each expanded node with the node id and depth
 */
export function walkBranch ({
  startId,
  nodes,
  skipCollapsed,
}: { startId: string, nodes: SourceNodeMap, skipCollapsed: boolean}, cb: Function) {
  let walkedVennSearch = false

  function handleNode (id: string, index: number) {
    if (id === VENN_ID) {
      if (walkedVennSearch) {
        return
      }
      walkedVennSearch = true
    }

    cb(id, index)
    index += 1

    nodes[id].outgoing.forEach((outgoing) => {
      const collapsed = nodes[id].relatives[outgoing._id].collapsed

      if (skipCollapsed && collapsed) {
        return
      }

      handleNode(outgoing._id, index)
    })
  }
  handleNode(startId, 0)
}

function findPropertyValue (properties: Property[], title: string, cluster: string) {
  const property = properties.find(property => property.title === title && property.cluster === cluster)
  return property ? property.value : null
}

function createOrbitSorter ({
  properties,
  activeProperties,
}: { properties: FocusedNodeProperties, activeProperties: ActiveProperty[] }) {
  return function sortOrbit (a: Relative & SourceNode, b: Relative & SourceNode) {
    // When properties are active, they override all other sorting rules
    if (activeProperties.length) {
      let aProperties = properties[a._id] ? properties[a._id].properties : []
      let bProperties = properties[b._id] ? properties[b._id].properties : []

      for (let i = 0; i < activeProperties.length; i++) {
        let aValue = findPropertyValue(aProperties, activeProperties[i].title, activeProperties[i].cluster)
        let bValue = findPropertyValue(bProperties, activeProperties[i].title, activeProperties[i].cluster)
        let direction = activeProperties[i].sortDirection

        if (aValue !== bValue) {
          // TODO: this does not handle sorting strings alphabetically
          if (direction === SORT_DESCENDING || bValue === null) {
            return bValue - aValue
          } else if (direction === SORT_ASCENDING || aValue === null) {
            return aValue - bValue
          } else {
            break
          }
        }
      }
    }

    const aParentCluster = isCluster(a) && a.linkDirection === 'parent' ? 1 : 0
    const bParentCluster = isCluster(b) && b.linkDirection === 'parent' ? 1 : 0

    if (aParentCluster || bParentCluster) {
      return bParentCluster - aParentCluster
    }

    const aMiniCluster = a.miniCluster ? 1 : 0
    const bMiniCluster = b.miniCluster ? 1 : 0

    if (aMiniCluster || bMiniCluster) {
      return bMiniCluster - aMiniCluster
    }

    // TODO: this should take into account if parents or children are shown on orbits
    const aCount = a.childCount + b.parentCount
    const bCount = b.childCount + b.parentCount
    if (aCount !== bCount) {
      return bCount - aCount
    }

    if (a._id < b._id) {
      return -1
    } else if (a._id > b._id) {
      return 1
    }

    return 0
  }
}

/**
 *
 */
export function relativesOnOrbit (
  relatives: RelativeMap,
  {
    parentFrom = {},
    reorderedRelatives = [],
    noLimit = false,
    properties = {},
    activeProperties = [],
    orbitLocked = false,
  }: { parentFrom?: {[index: string]: NodeFrom}, reorderedRelatives?: ReorderedRelative[], noLimit?: boolean, properties?: FocusedNodeProperties, activeProperties?: ActiveProperty[], orbitLocked?: boolean} = {}) {
  let maxVisibleRelatives = orbitLocked ? MAX_VISIBLE_RELATIVES_ORBIT_LOCKED : MAX_VISIBLE_RELATIVES
  let hasGateways = false

  // Gateways are always shown on the orbit.
  // They are all stored in this array, and then spliced onto the unexploredRelatives array
  let gatewayRelatives: Array<Relative | NodeFrom> = []

  // Stores all relatives that could be shown in the orbit
  let unexploredRelatives: Relative[] = []

  // array of id's of nodes that have a gateway to this node
  let incoming = Object.keys(parentFrom || {}).reduce(
    (result, key) => {
      if (parentFrom[key].gateway) {
        result.push(key)
      }

      return result
    },
    []
  )

  Object.keys(relatives).forEach(key => {
    let relative = relatives[key]

    // show gateway back to nodes that have a gateway to this node
    if (incoming.indexOf(relative._id) > -1) {
      incoming.splice(incoming.indexOf(relative._id), 1)
      relative.gateway = true
    }
    if (relative.gateway === true) {
      hasGateways = true
      gatewayRelatives.push(relative)
    } else if (!('expanded' in relative) && !(relative._id in parentFrom)) {
      // relative is not this node's parent, is not a gateway, and is not expanded
      unexploredRelatives.push(relative)
    }
  })

  // these are nodes with a gateway to this node
  // that are not also a child of this node
  let from = parentFrom || {}
  incoming.forEach(key => {
    from[key]._id = key
    gatewayRelatives.push(from[key])
  })
  const sorter = createOrbitSorter({
    properties,
    activeProperties,
  })
  // Sort so we know which ones will be shown
  unexploredRelatives = unexploredRelatives.sort(sorter)

  // TODO: we should not be mixing NodeSource with Child
  let gateways = <Relative[]>gatewayRelatives
  
  // Replaces some of the children that would be shown on the orbit with
  // gateways
  unexploredRelatives.splice(
    maxVisibleRelatives - gatewayRelatives.length,
    gatewayRelatives.length,
    ...gateways
  )

  if (!noLimit) {
    unexploredRelatives = unexploredRelatives.slice(0, maxVisibleRelatives)
  }

  // sort again to put gateways in correct location
  unexploredRelatives.sort(sorter)

  // Add reordered children
  if (!noLimit) {
    reorderedRelatives.forEach((relative) => {
      const index = unexploredRelatives.indexOf(findNodeById(unexploredRelatives, relative._id))
      if (index === -1) {
        return
      }

      const removedChild = unexploredRelatives.splice(index, 1)
      unexploredRelatives.splice(relative.index, 0, removedChild[0])
    })
  }

  return {
    visibleChildren: unexploredRelatives,
    hasGatewayChildren: hasGateways,
  }
}

/**
 * Finds a parent with the child
 *
 * @export
 * @param {String} childId
 * @param {Object} children Object, each key should be a parent, and it's fields should have the children
 * @returns {String | false} parent id
 */
export function findNodeWithRelative (relativeId: string, nodesWithRelatives: SourceNodeMap) {
  const nodeKeys = Object.keys(nodesWithRelatives)

  for (let i = 0; i < nodeKeys.length; i++) {
    if (relativeId in nodesWithRelatives[nodeKeys[i]]) {
      return nodeKeys[i]
    }
  }

  return false
}


/**
 * Prepares nodes to be used in generating a layout
 * And adds some properties on to them for easy access later
 * NOTE: this mutates the nodes object
 *
 * @param { object } nodes object of nodes. Each node should have a children property with object of children
 * @returns { object } the first node
 */
export function prepareNodes (nodes: {[index: string]: SourceNode}) {
  let firstNode: SourceNode = null
  // find first node, potential links, and node it expanded from
  Object.keys(nodes).forEach((key) => {
    let node = nodes[key]

    if (firstNode === null) {
      const keys = Object.keys(node.from)
      let result = true

      for (let i = 0; i < keys.length; i++) {
        if (node.from[keys[i]].gateway) {
          continue
        } else {
          result = false
          break
        }
      }

      if (result) {
        firstNode = node
      }
    }

    // cache result for later, and for use in react components
    node.originallyFrom = nodeOriginallyFrom(node)

    node.outgoing = findOutgoing(node)
  })

  return {
    firstNode,
  }
}

/**
 * Creates an array of nodes in the order they were opened. Tries to emulate the
 * lineage tool, although it shows nodes that were collapsed then restored later
 * in the lineage than the lineage tool does
 */
export function lineageFromPath (path: any) {
  if (typeof path.nodes === 'undefined') {
    // Is an invalid path. Most likely caused by temporary bugs in the fixed path
    // created while developing
    console.warn('invalid path', path)
    return null
  }

  const expandedNodes: any = []
  const nodes = Object.keys(path.nodes).reduce((result: any, nodeKey) => {
    result[nodeKey] = {
      ...path.nodes[nodeKey],
      children: path.children[nodeKey],
    }

    return result
  }, {})

  // This also mutates the nodes object by adding some properties to each node
  const {
    firstNode,
  } = prepareNodes(nodes)

  walkBranch({
    startId: firstNode._id,
    nodes,
    skipCollapsed: false,
  }, (nodeId: string) => {
    expandedNodes.push(nodeId)
  })

  const lineage = expandedNodes.map((id: string) => {
    let node = nodes[id]
    return {
      node,
      expandIndex: node.originallyFrom ? path.children[node.originallyFrom][id].expanded : 0,
    }
  })
    .sort((a: any, b: any) => a.expandIndex - b.expandIndex)

  return {
    lineage: lineage.map(({ node }: any) => node),
    maxExpandedIndex: lineage[lineage.length - 1].expandIndex,
  }
}

/**
 * Find a node in the paths history
 * @param {Array} paths the paths
 * @param {String} id the id to find
 */
export const findInPaths = (paths: any, id: any) => {
  for (let pathIndex = 0; pathIndex < paths.length; ++pathIndex) {
    const { history = [] } = paths[pathIndex]
    const historyIndex = history.findIndex((historyItem: any) => historyItem.id === id)

    if (historyIndex >= 0) {
      return {
        pathIndex,
        history,
        historyIndex,
        ...history[historyIndex],
      }
    }
  }
  return {}
}
