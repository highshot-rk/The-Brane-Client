import { isCluster } from 'utils/tags'
import { NodePosition, Relative } from 'containers/FixedPath/types'

export function orbitPositions (_nodes: Array<Relative | null>, focusedChild?: string) {
  let {
    nodes,
    clusters,
  } = _nodes
    .reduce((result, _node) => {
      // TODO: see if we can avoid shallow cloning every child since some
      // nodes could eventually have millions
      const node = { ..._node, focused: _node._id === focusedChild }

      // Identify first four parent clusters to be used for miniclusters
      if (result.clusters.length < 4 && isCluster(node) && node.linkDirection === 'parent') {
        result.clusters.push(node)
      } else {
        result.nodes.push(node)
      }

      return result
    }, { nodes: [], clusters: [] })
  let positions: NodePosition[] = miniClusterPositions(clusters)
  let middle = Math.ceil(nodes.length / 2)
  let leftNodes = nodes.slice(0, middle).reverse()
  let rightNodes = nodes.slice(middle)

  let spaceBetween = Math.max(Math.PI * 0.075, (Math.PI * 0.40) / leftNodes.length)
  let angle = -Math.PI - ((leftNodes.length - 1) * spaceBetween) / 2 - 0.10

  leftNodes.forEach((node, i) => {
    positions.push({
      node,
      angle: angle + i * spaceBetween,
      side: 'left',
    })
  })

  angle = -((rightNodes.length - 1) * spaceBetween) / 2 - 0.044
  rightNodes.forEach((node, i) => {
    positions.push({
      node,
      angle: angle + i * spaceBetween,
      side: 'right',
    })
  })

  return positions
}

export function singleNodeViewPositions (_nodes: Array<Relative>, radius: number, scrollPosition: number, focusedChild: Relative): NodePosition[] {
  let nodes = [..._nodes]
  nodes = nodes.map(node => ({ ...node, focused: false }))
  if (focusedChild) {
    const focusedChildIndex = nodes.findIndex(child => child._id === focusedChild._id)
    if (focusedChildIndex !== -1) {
      // TODO: remove this mutation
      // TODO: this is probably unused
      (nodes[focusedChildIndex] as any).focused = (focusedChild as any).focused
    }
  }
  const VISIBLE_SPACING = 19
  const SPACING_RANGE = 1.5
  const visibleCount = Math.round(Math.min(radius / VISIBLE_SPACING, nodes.length))
  const spaceBetween = Math.PI / SPACING_RANGE / visibleCount
  const scrollDistance = (nodes.length - visibleCount) * spaceBetween + spaceBetween
  let visibleStart = scrollDistance * scrollPosition
  let firstNode = Math.round(visibleStart / spaceBetween)

  let positions: NodePosition[] = []
  let visibleNodes = nodes.slice(firstNode, firstNode + visibleCount)

  const offset = visibleStart - (firstNode * spaceBetween)

  let angle = 1.27 * Math.PI + offset

  visibleNodes.forEach((node, i) => {
    positions.push({
      node,
      angle: angle - i * spaceBetween,
      side: 'left',
      faded: firstNode + visibleCount !== nodes.length && i === visibleCount - 1,
    })
  })

  if (firstNode !== 0) {
    positions.unshift({
      node: nodes[firstNode - 1],
      angle: angle + spaceBetween,
      side: 'left',
      faded: true,
    })
  }

  return positions
}

const centeredTop = -Math.PI * 0.5 - 0.07
const clusterPositionRange = 2.2
const leftPosition = centeredTop - clusterPositionRange / 2

export function miniClusterPositions (clusters: Relative[]): NodePosition[] {
  return clusters.map((cluster: Relative, index: number) => {
    return {
      node: cluster,
      angle: leftPosition + (clusterPositionRange / (clusters.length + 1) * (index + 1)),
      side: 'top',
      miniCluster: true,
    }
  })
}

export function angleToCoords (angle: number, radius: number) {
  return {
    x: radius * Math.cos(angle + 0.074),
    y: radius * Math.sin(angle + 0.074),
  }
}
