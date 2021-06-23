// import { SMALL_NODE_RADIUS } from './index.js'
import { nodePos, layoutBounds, GRID_SPACING, Coords } from './layout'
import { ANGLES, findNodeById, closestQuadrant } from '../../utils/fixed-path'
import { SourceNode, Quadrant, SourceNodeMap } from './types'

const RADIUS = 45

/**
 * Finds nodes that are at least partially visible.
 * Not 100% accurate, but close enough for most uses.
 *
 * @param {Number} x position of fixed path
 * @param {Number} y position of fixed path
 * @param {Node[]} nodes
 * @returns {Node[]} nodes that are visible
 */
export function findVisibleNodes (x: number, y: number, nodes: SourceNode[]) {
  const width = window.innerWidth
  const height = window.innerHeight

  const minX = x - RADIUS
  const maxX = x + width + RADIUS
  const minY = y - RADIUS
  const maxY = y + height + RADIUS

  return nodes.filter((node) => {
    if (node.x < minX || node.x > maxX) {
      return false
    }
    if (node.y < minY || node.y > maxY) {
      return false
    }

    return true
  })
}

/**
 * Finds an empty position to place the node. Starts at the starting position, and then
 * moved left/right and up/down to look for a position. What direction it searches is
 * based on the angle and comparing the startingPos.x and parent.x
 *
 * @param {{ x: Number, y: Number }} startingPos First position to check
 * @param {{ x: Number, y: Number}} parent Position of node used with the angle to calculte the starting position
 * @param {Number} angle Angle of the quadrant
 * @param {Object} positions Each key should be 'x-y' of the locations there is a node
 */
function findEmptyPosition (startingPos: Coords, parent: Coords, angle: Quadrant, positions: SourceNodeMap) {
  let yChange = 1
  let xChange = 1
  let x = startingPos.x
  let y = startingPos.y
  let found = false
  let attempt = 0

  if (angle === 315 || angle === 45) {
    yChange = -1
  }
  if (startingPos.x < parent.x) {
    xChange = -1
  }

  while (!found) {
    if (attempt % 2 === 1 && attempt > 0) {
      x += -2 * xChange
    } else if (attempt > 0) {
      x += xChange
      y += yChange
    }

    let exists = positions[`${x}-${y}`]
    if (!exists) {
      found = true
    }

    attempt += 1
  }

  return {
    x,
    y,
  }
}

/**
 * Positions visible nodes. It does not position expanded children since
 * that isn't needed yet.
 *
 * @param {Node[]} visibleNodes
 * @param {Number} index Index of the current node to position in visibleNodes
 * @param {Object} positions
 * @param {Node} focusedNode
 */
export function positionNodeAndExpandedChildren (visibleNodes: SourceNode[], index: number, positions: SourceNodeMap, focusedNode: SourceNode) {
  let x
  let y
  let node = visibleNodes[index]
  let results = []

  if (!('0-0' in positions)) {
    x = 0
    y = 0
  } else if (results.length) {
    console.log('placing consecutive node')
  } else {
    const firstNode = positions['0-0']
    const angle = Math.atan2(node.x - focusedNode.x, node.y - focusedNode.y) * (180 / Math.PI)
    const quadrant = closestQuadrant(angle, ANGLES)
    let startingPos = nodePos(firstNode.x, firstNode.y, quadrant)

    const pos = findEmptyPosition(startingPos, firstNode, quadrant, positions)
    x = pos.x
    y = pos.y
  }

  node = {
    ...node,
    x,
    y,
  }

  results.push(node)
  positions[`${x}-${y}`] = node

  if (visibleNodes[index].outgoing.length > 0) {
    visibleNodes[index].outgoing.forEach((outgoing) => {
      if (findNodeById(visibleNodes, outgoing._id)) {
        console.log('outgoing node is visible')
      }
    })
  }
  return results
}

/**
 * Moves nodes by the supplied amount
 *
 * @param {Node[]} nodes
 * @param {Number} moveX
 * @param {Number} moveY
 */
export function shiftPos (nodes: SourceNode[], moveX: number, moveY: number) {
  return nodes.map((node) => {
    node.x += moveX
    node.y += moveY
    return node
  })
}

/**
 * A very simple version of layout.js for when the
 * node positions are less important, and links are not needed.
 *
 * When the Single Node View is opened, the other visible nodes need to be moved out of the way.
 * This calculates where they should be moved to.
 *
 * @param {Number} x Position of fixed path
 * @param {Number} y Position of fixed path
 * @param {Node[]} _nodes
 * @param {Node} focusedNode
 */
export function compressedLayout (x: number, y: number, _nodes: SourceNode[], focusedNode: SourceNode) {
  let nodes = _nodes.slice()

  // remove focused node
  const focusedIndex = nodes.indexOf(focusedNode)
  nodes.splice(focusedIndex, 1)

  nodes = nodes.map((node) => {
    return {
      ...node,
      orbitLocked: false,
      hasCollapsed: false,
    }
  })

  let placedNodes: SourceNode[] = []

  const visibleNodes = findVisibleNodes(x, y, nodes).sort((a: SourceNode, b: SourceNode) => {
    // Sort by angle
    const aAngle = Math.atan2(focusedNode.x + a.x, focusedNode.y + a.y)
    const bAngle = Math.atan2(focusedNode.x + b.x, focusedNode.y + b.y)
    if (aAngle !== bAngle) {
      return aAngle - bAngle
    } else {
      return a.x - b.x
    }
  })

  const positions = {}

  visibleNodes.forEach((node, i) => {
    const index = nodes.indexOf(node)
    nodes.splice(index, 1)

    placedNodes.push(...positionNodeAndExpandedChildren(visibleNodes, i, positions, focusedNode))
  })

  const hiddenNodes = nodes.map((node) => {
    return {
      ...node,
      x: x - 10000,
      y: y - 10000,
    }
  })

  placedNodes = placedNodes.map((node) => {
    node.x *= GRID_SPACING.x / 1.5
    node.y *= GRID_SPACING.y / 1.5
    return node
  })

  let bounds = layoutBounds(placedNodes)

  shiftPos(placedNodes, Math.abs(bounds.minX), Math.abs(bounds.minY))
  shiftPos(placedNodes, x + 120, y + 50)

  bounds = layoutBounds(placedNodes)

  const allowedWidth = Math.max(document.body.clientWidth - 400 - (document.body.clientHeight * 1.058 / 2 + 20), 25)

  if (bounds.maxX - bounds.minX > allowedWidth) {
    shiftPos(placedNodes, -1 * Math.abs(bounds.maxX - bounds.minX + (2 * RADIUS) - allowedWidth), 0)
  }

  /**
   * If the order changes, react recreaters the dom elements for some of the nodes.
   * Those nodes then aren't transitioned to their new position or size.
   */
  const allNodes = [...placedNodes, ...hiddenNodes, focusedNode].sort((a, b) => {
    const aIndex = _nodes.indexOf(findNodeById(_nodes, a._id))
    const bIndex = _nodes.indexOf(findNodeById(_nodes, b._id))
    return aIndex - bIndex
  })

  return allNodes
}
