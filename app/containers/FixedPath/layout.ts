import { ANGLES, branchDetails, closestQuadrant, prepareNodes } from '../../utils/fixed-path'

import { closest } from 'utils/math'
import { VENN_ID } from '../../constants'
import { SourceNodeMap, SourceNode, LayoutLink, NodeFrom, Relative, Quadrant, LayoutNode, NodeWithRelatives } from './types'

export const GRID_SPACING = {
  x: 270,
  y: 250,
}

export type Coords = {
  x: number,
  y: number
};

type CoordMap = {
  [index: string]: Coords
}

/*
 * If a node has at least one expanded child, and the open positions
 * around the node is 0, the newest node's branch is started someplace
 * else. This object stores the positions for those nodes between
 * regenerating.
 *
 * This is the only part of the layout generator that is stateful to
 * avoid unnecessary changes in the layout
 */
let SplitBranchesPos: CoordMap = {}

/**
 * Calculates grid position of expanded child
 *
 * @param {Number} parentX x position of child's parent
 * @param {Number} parentY y position of child's parent
 * @returns {Object} calculated with x and y properties
 */
export function nodePos (parentX: number, parentY: number, angle: number) {
  let x = 0
  let y = 0
  switch (angle) {
    case 45:
      x = parentX + 1
      y = parentY - 1
      break
    case 135:
      x = parentX + 1
      y = parentY + 1
      break
    case 225:
      x = parentX - 1
      y = parentY + 1
      break
    case 315:
      x = parentX - 1
      y = parentY - 1

    // no default
  }
  return {
    x: x,
    y: y,
  }
}

export function findNodeOnLeft (node: LayoutNode, nodePositions: SourceNodeMap) {
  return nodePositions[`${node.x / GRID_SPACING.x - 2}-${node.y / GRID_SPACING.y}`]
}

export function findNodeOnRight (node: LayoutNode, nodePositions: SourceNodeMap) {
  return nodePositions[`${node.x / GRID_SPACING.x + 2}-${node.y / GRID_SPACING.y}`]
}

export function orbitVisible (node: SourceNode) {
  return node.orbitLocked || node.hasCollapsed
}

export function layoutBounds (nodes: SourceNode[]) {
  let minX = 10000000000000
  let maxX = -10000000000000
  let minY = 10000000000000
  let maxY = -10000000000000

  nodes.forEach((node) => {
    if (node.x < minX) {
      minX = node.x
    }
    if (node.x > maxX) {
      maxX = node.x
    }
    if (node.y < minY) {
      minY = node.y
    }
    if (node.y > maxY) {
      maxY = node.y
    }
  })

  return {
    minX,
    maxX,
    minY,
    maxY,
  }
}

/**
 * Finds available quadrants around node at supplied location
 * @param {Object} filledPositions. Each key should be in the format of "x-y" and represents a location occupied by node
 * @param {Number} x of parent node
 * @param {Number} y of parent node
 * @param {Number[]} Array of angles of available quadrants
 */
export function availablePos (filledPositions: CoordMap, x: number, y: number) {
  let results: Quadrant[] = []
  ANGLES.forEach((angle) => {
    let pos = nodePos(x, y, angle)
    if (!(`${pos.x}-${pos.y}` in filledPositions)) {
      results.push(angle)
    }
  })
  return results
}

/**
 * Calculates if the nodes are next to each other. It will return true even if they are adjacent at 90 deg
 *
 * @param {Object} node1 - must have x and y properties
 * @param {Object} node2 - must have x and y properties
 * @returns {Bool} true if they are adjacent
 */
export function adjacent (node1: SourceNode, node2: SourceNode) {
  const MAX_DISTANCE = checkAngleIs90(node1, node2) ? 2 : 1.6
  return (Math.abs(node1.x - node2.x) <= GRID_SPACING.x * MAX_DISTANCE &&
    Math.abs(node1.y - node2.y) <= GRID_SPACING.y * MAX_DISTANCE)
}

/**
 * When there are links at 90 deg, it is possible for two links to cross over
 * This function checks if that is happening with the supplied link
 *
 * @param {Object} positions each key should be in the format of "x-y" and the value should be the node in that location
 * @param {Number} expanded index of link
 * @param {Number} startX link coordinate
 * @param {Number} startY link coordinate
 * @param {Number} stopX link coordinates
 * @param {Number} stopY link coordinate
 *
 * @returns {Object}
 * @returns {Object.crossover} true if another link crosses over the supplied link
 * @returns {Object.otherNodes[]} array with the two nodes that are on either end of the link that crosses over
 * @returns {Object.older} true if link from start to stop coordinates is older than crossover link
 */
export function crossOver90deg (positions: SourceNodeMap, expandedIndex: number, startX: number, startY: number, stopX: number, stopY: number) {
  let left = (startX > stopX ? stopX : startX) / GRID_SPACING.x
  let top = (startY > stopY ? stopY : startY) / GRID_SPACING.y
  let node1
  let node2

  if (startY === stopY) {
    // link is horizontal
    node1 = positions[`${left + 1}-${top - 1}`]
    node2 = positions[`${left + 1}-${top + 1}`]
  }
  if (startX === stopX) {
    // link is vertical
    node1 = positions[`${left - 1}-${top + 1}`]
    node2 = positions[`${left + 1}-${top + 1}`]
  }

  if (!node1 || !node2) {
    return {
      crossover: false,
    }
  }
  if (node1.from[node2._id] && node1.from[node2._id].gateway) {
    return {
      crossover: true,
      otherNodes: [node1, node2],
      older: node2.relatives[node1._id].expanded > expandedIndex,
    }
  }
  if (node2.from[node1._id] && node2.from[node1._id].gateway) {
    return {
      crossover: true,
      otherNodes: [node1, node2],
      older: node1.relatives[node2._id].expanded > expandedIndex,
    }
  }
  return {
    crossover: false,
  }
}

export function sortIdByExpanded (nodes: SourceNodeMap, nodesToSort: SourceNode[]) {
  return nodesToSort.sort((node1: SourceNode, node2: SourceNode) => {
    // TODO: check changing this to subtraction doesn't change sort order
    return nodes[node1.originallyFrom].relatives[node1._id].expanded -
      nodes[node2.originallyFrom].relatives[node2._id].expanded
  }).map((node: SourceNode) => {
    return node._id
  })
}

/**
 * Checks if the angle between two nodes is 90 deg
 *
 * @param {Object} node1 must have x and y properties
 * @param {Object} node2 must have x and y properties
 * @returns {Boolean} true if the angle is 90 deg
 */
export function checkAngleIs90 (node1: SourceNode, node2: SourceNode) {
  if (Math.abs(node1.x - node2.x) === 0) {
    return true
  }
  if (Math.abs(node1.y - node2.y) === 0) {
    return true
  }

  return false
}

/**
 * Creates array of relatives that are expanded and not a gateway
 * @param {Node} node
 * @returns {Child[]}
 */
export function findOutgoing (node: SourceNode) {
  let outgoing: Relative[] = []

  Object.keys(node.relatives).forEach((key) => {
    let child = node.relatives[key]
    if (child._id === VENN_ID && !child.collapsed) {
      return
    }
    if (typeof child.expanded === 'number' && child.gateway !== true) {
      outgoing.push(child)
    }
  })

  return outgoing.sort((a, b) => {
    return b.expanded - a.expanded
  })
}

/**
 * Returns the parent that first expanded this node.
 * In other words, it finds parent that it is not a gateway from
 * @props {Object} node - Needs to have a from object
 * @returns {String} id of parent
 */
export function nodeOriginallyFrom (node: NodeWithRelatives) {
  let keys = Object.keys(node.from)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    if (node.from[key].gateway !== true) {
      return key
    }
  }
}

/**
 * Returns an array with all outgoing nodes that are not collapsed
 *
 * @export
 * @param {Object[]} outgoing - nodes that are outgoing from parent
 * @param {Object[]} parent - parent of outgoing nodes
 * @param {Object} object with all nodes. The keys should be the node's id
 * @returns Array with noncollapsed outgoing nodes
 */
export function removeCollapsedBranches (outgoing: Relative[], parent: SourceNode, nodes: SourceNodeMap) {
  let nonCollapsed: Relative [] = []
  outgoing.forEach((node) => {
    if (nodes[node._id].collapsed) {
      // change child to gateway
      parent.relatives[node._id].gateway = true
      parent.relatives[node._id].collapsed = true
      let { length } = branchDetails(nodes[node._id], nodes)
      if (length > 0) {
        // TODO: avoid mutating 
        parent.relatives[node._id].branchLength = length
      }
      return
    }
    nonCollapsed.push(node)
  })
  if (outgoing.length > nonCollapsed.length) {
    parent.hasCollapsed = true
  }
  return nonCollapsed
}

// Find the best candidate of outgoing nodes to collapse
// Prefers the smallest outgoing branch
export function outgoingToRemove (rawOutgoing: Relative[], openPositions: number[], nodes: SourceNodeMap) {
  // Use an object instead of adding a property to avoid mutating nodes
  let branchLengths: { [index: string]: number } = {}
  let branchNewestExpanded: { [index: string]: number} = {}

  let outgoing = rawOutgoing.filter((item) => item !== undefined)

  // find length of branches
  outgoing.forEach((node, i) => {
    let details = branchDetails(nodes[node._id], nodes)
    branchLengths[node._id] = details.length
    branchNewestExpanded[node._id] = details.newestIndex
  })
  // sort by branch length, then by expand number
  outgoing.sort((node1, node2) => {
    if (branchLengths[node1._id] > branchLengths[node2._id]) {
      return 1
    } else if (branchLengths[node1._id] < branchLengths[node2._id]) {
      return -1
    }
    // same branch length
    const node1NewestExpanded = branchNewestExpanded[node1._id]
    const node2NewestExpanded = branchNewestExpanded[node2._id]
    return node1NewestExpanded > node2NewestExpanded ? 1 : -1
  })
  const nodeToRemove = nodes[outgoing[0]._id]
  if (branchLengths[nodeToRemove._id] > 0) {
    nodes[nodeToRemove.originallyFrom].relatives[nodeToRemove._id].branchLength = branchLengths[nodeToRemove._id]
  }
  return nodes[outgoing[0]._id].angle
}

type Prop = keyof SourceNode & keyof NodeFrom

/**
 * Find index of first node with value
 */
export function nodePropIndex (nodes: SourceNode[] | NodeFrom[] | Relative[], prop: Prop, value: any) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i][prop] === value) {
      return i
    }
  }
  return -1
}

/**
 * Creates array of expanded relatives that need to be added to the layout
 * It does not add collapsed nodes
 * It also calculates the best available quadrant, taking into account quadrants other relatives
 * of the node will use
 * @param {Number[]} openPositions the quadrant angles around the parent that are available
 * @param {Object[]} outgoing
 * @param {Object} Object with all of the nodes. Keys should be the id of nodes
 */
export function prepareNextNodes (openPositions: Quadrant[], outgoing: Relative[], nodes: SourceNodeMap) {
  let nextNodes: SourceNode[] = []

  // Nothing to prepare
  if (outgoing.length === 0) {
    return nextNodes
  }

  // remove collapsed nodes and venn-diagram search results
  outgoing = outgoing.reduce((result: Relative[], node: Relative) => {
    if (nodes[node._id].collapsed || node._id === VENN_ID) {
      return result
    }
    result.push(node)
    return result
  }, [])

  // TODO: should also consider expanded index of expanded relatives
  outgoing.sort(
    (node1: Relative, node2: Relative) => {
      const node1Parent = nodes[nodes[node1._id].originallyFrom]
      const node2Parent = nodes[nodes[node2._id].originallyFrom]
      return node1Parent.relatives[node1._id].expanded > node2Parent.relatives[node2._id].expanded ? 1 : -1
    }
  )

  if (openPositions.length === 0) {
    // There are no space limitations when we split
    // and it causes problems with restoring branches
    // if we limit how many outgoing nodes are split
    outgoing.forEach(({ _id }: Relative) => {
      let node = nodes[_id]
      let from = node.originallyFrom
      node.split = true

      // add gateways
      nodes[from].relatives[node._id].gateway = true
      node.from[from].gateway = true
      node.from[from].title = nodes[from].title

      nextNodes.push(node)
    })

    return nextNodes
  }

  // TODO: if a child, or child of child is focused, it should not remove that node
  let usedQuadrants = []

  // starts with oldest outgoing node of those that were kept
  for (let i = 0; i < outgoing.length; i++) {
    if (openPositions.length === 0 && usedQuadrants.length > 0) {
      // find a child that can be collapsed to make space for newer relatives
      let angle = outgoingToRemove(outgoing.slice(0, i), usedQuadrants, nodes)
      usedQuadrants.splice(usedQuadrants.indexOf(angle), 1)
      openPositions.push(angle)
    }
    let node = nodes[outgoing[i]._id]
    let preferredAngle = node.from[nodeOriginallyFrom(node)].angle
    let angle = closestQuadrant(preferredAngle, openPositions)
    node.angle = openPositions.splice(openPositions.indexOf(angle), 1)[0]
    usedQuadrants.push(node.angle)

    // Check if we previously put a child at this index, and remove it from
    // next nodes and mark it as collapsed
    // This can happen when we run out of open positions
    // and collapse an older branch
    // TODO: fix the types
    const previousNodeWithAngle = nodePropIndex(nextNodes, ('angle' as any), angle)
    if (previousNodeWithAngle > -1) {
      let _node = nodes[nextNodes.splice(previousNodeWithAngle, 1)[0]._id]
      _node.collapsed = true
      outgoing[nodePropIndex(outgoing, '_id', _node._id)] = undefined

      // mark as gateway and collapsed
      nodes[_node.originallyFrom].hasCollapsed = true
      nodes[_node.originallyFrom].relatives[_node._id].gateway = true
      nodes[_node.originallyFrom].relatives[_node._id].collapsed = true
    }

    nextNodes.push(node)
  }

  return nextNodes
}

/**
 * Generates array of nodes and array of links and calculates their positions.
 * @param { object } nodes object of nodes. Each node should have a relative property with object of relatives
 */
export default function generateNodesAndLinks (_nodes: {[index: string]: SourceNode}) {
  let layoutNodes: SourceNode[] = []
  let links: LayoutLink[] = []
  let OldSplitBranchesPos = SplitBranchesPos
  let positions: SourceNodeMap = {}
  let nodesFromSplitBranches: SourceNode[] = []
  let startPos = { x: 0, y: 0 }

  if (Object.keys(OldSplitBranchesPos).length > 0) {
    positions = Object.keys(OldSplitBranchesPos).reduce((result: SourceNodeMap, key) => {
      let pos = OldSplitBranchesPos[key]
      result[`${pos.x}-${pos.y}`] = null
      return result
    }, {})
  }

  let {
    firstNode,
  } = prepareNodes(_nodes)

  let nodes = <SourceNodeMap>_nodes

  positions[`${startPos.x}-${startPos.y}`] = firstNode

  let followedNodes: SourceNodeMap = {}
  let nextNodes: SourceNode[] = []

  // Start at node
  // and generate positions, links, and decide angles
  function nodePosition (startNode: SourceNode) {
    layoutNodes.push(startNode)
    followedNodes[startNode._id] = startNode

    // first node in path should be at (0, 0)
    startNode.x = startPos.x
    startNode.y = startPos.y

    if (layoutNodes.length > 1 && !startNode.split) {
      let angle = startNode.angle
      let parent = nodes[nodeOriginallyFrom(startNode)]

      let position = nodePos(parent.x, parent.y, angle)
      startNode.x = position.x
      startNode.y = position.y
    } else if (startNode.split) {
      // This is the start of a new section because there
      // was no open spot around it's parent node to show it
      let pos = {
        x: 0,
        y: 0,
      }
      let hasPos = false
      if (startNode._id in OldSplitBranchesPos) {
        pos = OldSplitBranchesPos[startNode._id]

        // Check if it's previous location was already taken
        // TODO: prevent it from being taken by another split branch
        let key = `${pos.x}-${pos.y}`
        hasPos = !(positions[key] && positions[key]._id)
      }
      if (!hasPos) {
        // find position
        let bounds = layoutBounds(layoutNodes)
        // TODO: there are lots of more complex alternatives
        // that would result in a better looking position
        pos.y = bounds.minY - 1
        pos.x = Math.floor(Math.random() * (bounds.maxX - bounds.minX + 1)) + bounds.minX

        // Make sure it is offset from the row below it, otherwise,
        // if a node is expanded into the row below, it could overlap a node or it's relatives
        // True if it doesn't apply to this row
        const isEvenOnEvenRow = Math.abs(pos.y % 2) === 0 ? Math.abs(pos.x % 2) === 0 : true
        const isOddOnOddRow = Math.abs(pos.y % 2) === 1 ? Math.abs(pos.x % 2) === 1 : true

        if (!isEvenOnEvenRow || !isOddOnOddRow) {
          // Randomly move 1 to the right or left
          const adjustment = closest(Math.random() * 2 - 1, [-1, 1])
          pos.x += adjustment
        }
      }

      startNode.x = pos.x
      startNode.y = pos.y
      SplitBranchesPos[startNode._id] = pos
      positions[`${pos.x}-${pos.y}`] = startNode
    }

    let openPositions = availablePos(positions, startNode.x, startNode.y)
    startNode.outgoing = removeCollapsedBranches(startNode.outgoing, startNode, nodes)
    let nodesToAdd = prepareNextNodes(openPositions, startNode.outgoing, nodes)
    let nodesToRemove: number[] = []
    nodesToAdd.forEach((node, i) => {
      if (node.split) {
        nodesToRemove.push(i)
        return
      }
      let pos = nodePos(startNode.x, startNode.y, node.angle)
      node.x = pos.x
      node.y = pos.y
      positions[`${pos.x}-${pos.y}`] = node
    })
    nodesToRemove.reverse().forEach((index) => {
      nodesFromSplitBranches.push(...nodesToAdd.splice(index, 1))
    })
    nextNodes.push(...nodesToAdd)
  }
  nodePosition(firstNode)
  while (nextNodes.length > 0) {
    nodePosition(nextNodes.shift())
  }

  nextNodes = nodesFromSplitBranches

  while (nextNodes.length > 0) {
    nodePosition(nextNodes.shift())
  }

  // calculate pixel coordinates of nodes
  layoutNodes = layoutNodes.map((node) => {
    node.openPositions = availablePos(positions, node.x, node.y)
    node.x = node.x * GRID_SPACING.x
    node.y = node.y * GRID_SPACING.y
    return node
  })

  // create links
  layoutNodes.forEach((node) => {
    if (node._id === firstNode._id) {
      return
    }
    Object.keys(node.from).forEach((key) => {
      let source = nodes[key]

      if (!adjacent(source, node)) {
        return
      }

      if (node.from[key].gateway) {
        if (checkAngleIs90(node, source)) {
          let overlappedResults = crossOver90deg(positions, source.relatives[node._id].expanded, node.x, node.y, source.x, source.y)
          if (overlappedResults.crossover && !overlappedResults.older) {
            return
          }
        }
        nodes[source._id].relatives[node._id].gateway = false
        node.from[key].gateway = false
      }
      links.push({
        x1: source.x,
        y1: source.y,
        x2: node.x,
        y2: node.y,
        sourceID: source._id,
        targetID: node._id,
        reversed: !!node.from[key].isParent,
      })
    })
  })

  return {
    layoutNodes,
    links: links,
    sourceNodes: nodes,
    positions: positions,
  }
}
