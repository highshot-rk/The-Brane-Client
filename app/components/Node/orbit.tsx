import { circleTop0, degreesToRadians, pythagorean, radiansToDegrees, circlePointFromAngle } from 'utils/math'
import { orbitPositions, singleNodeViewPositions } from './childPositions'

import Child from './child'
import CurvedScrollBar from 'components/CurvedScrollBar'
import DragExpandHint from 'components/Node/drag-expand-hint'
import DragReorderHint from 'components/Node/drag-reorder-hint'
import Line from 'components/Line'
import React, { ReactElement } from 'react'
import { calculateTextWidth } from 'utils/svg'
import { closestQuadrant } from 'utils/fixed-path'
import { OrbitWrapper } from './elements'
import { ESCAPE } from 'utils/key-codes'
import OrbitActions from 'components/Node/OrbitActions'
import { Quadrant, NodePosition, Relative } from 'containers/FixedPath/types'
import { FocusedNodeProperties, ActiveProperty, FocusedNodeProperty } from 'containers/PropertySidebar/types'
import { getUpDownText, isCluster } from 'utils/tags'
import { CircularProgress } from 'material-ui-core'
import { withStyles } from 'material-ui-core/styles'

type ScrollData = {
  visibleHeight: number,
  height: number,
}

type DraggedChild = {
  _id: string | null,
  x: number,
  y: number,
  // TODO: should be enum
  dragMode?: string | null,
  quadrant?: Quadrant,
  position?: NodePosition | null,
  linkType?: string | null,
  linkName?: string | null,
  cursorX?: number,
  cursorY?: number,
  reorderedIndex?: number,
  reorderedSide?: 'left' | 'right' | 'top' | null,
}

type Props = {
  showMenu: (node: Relative, x: number, y: number, isChild: boolean) => void,
  showSingleNodeView: (id: string) => void,
  addReorderedRelative: Function,
  menuOpenForChild: string,
  nodes: Relative[],
  radius: number,
  centerRadius: number,
  visible: boolean,
  rightMaxTitleLength: number,
  leftMaxTitleLength: number,
  parentTitle: string,
  parentId: string,
  parentCluster: boolean,
  draggingChild: Function,
  dragLinkMode: boolean,
  openExpandPositions: Quadrant[],
  childDragStopped: Function,
  exploreNode: Function,
  singleNodeView: boolean,
  singleNodeViewPrepared: boolean,
  focusChild: string,
  showNodeCreationWindow: Function,
  toggleClusterState: Function,
  activeProperties: ActiveProperty[],
  properties: FocusedNodeProperties,
  // TODO: this relative has additional properties it probably shouldn't
  onFocusedChild: (relative: any) => void,
  focusedChild: Relative,
  overlayOpen: boolean,
  showAddButton: boolean,
  openMenuFor: string,
  initialAppear: boolean,
  menuOpen: {
    node: {
      _id: string,
    },
    parentId: string,
    isChild: boolean,
    x: number,
    y: number
  },
  orbitLocked: boolean,
  showLinkPreview: (startId: string, stopId: string) => void,

  // TODO: check if we can remove this
  showTargetLinkNode: boolean,
  relativesLoading: boolean,
  color: string,
  focusedNode: boolean,
  preLoad: boolean
}

type State = {
  textRadius: number,
  scrollPosition: number,
  noChildren: boolean,
  disableAnimations: boolean,
  maxChildWidth: number,
  draggedChild: DraggedChild,
}

const ColorCircularProgress = withStyles({
  root: {
    overflow: 'visible !important',
  },
  circle: {
    color: '#0ED89B',
    strokeWidth: 2,
  },
})(CircularProgress)

const ColorCircularProgressStatic = withStyles({
  root: {
    overflow: 'visible !important',
  },
  svg: {
    overflow: 'visible !important',
  },
  circle: {
    color: '#0ED89B',
    strokeWidth: 2,
  },
})(CircularProgress)

export default class Orbit extends React.Component<Props, State> {
  static defaultProps = {
    activeProperties: ([] as ActiveProperty[]),
  }

  state = {
    textRadius: 0,
    scrollPosition: 0,
    noChildren: false,
    disableAnimations: false,
    maxChildWidth: 0,
    // TODO: figure out why this isn't automatically DraggedChild
    draggedChild: ({
      _id: null,
      x: 0,
      y: 0,
      cursorX: 0,
      cursorY: 0,
      dragMode: null,
      quadrant: (45 as Quadrant),
      position: null,
      linkType: null,
      linkName: null,
      reorderedIndex: null,
      reorderedSide: null,
    } as DraggedChild),
  }
  cachedScrollNumbers: {[index: string]: ScrollData} = {}
  nodePositions: {[index: string]: NodePosition} = {}

  showSingleNodeView = () => {
    this.props.showSingleNodeView(this.props.parentId)
  }
  updateScrollPosition = (scrollPosition: number) => {
    this.setState({
      scrollPosition: scrollPosition,
    })
  }
  maximumChildWidth = () => {
    // find longest name
    const longestTitle = this.props.nodes.reduce((result: string, node) => {
      return result.length > node.title.length ? result : node.title
    }, '')

    return calculateTextWidth(longestTitle) + 30
  }
  childDragStarted = (_id: string, cursorX: number, cursorY: number) => {
    this.props.draggingChild(_id)

    let textRadius = this.state.textRadius
    let maxChildWidth = this.state.maxChildWidth || this.maximumChildWidth()
    if (textRadius === 0) {
      textRadius = maxChildWidth + this.props.radius
    }

    const coords = this.nodePositions[_id]
    const child = this.props.nodes.find(child => child._id === _id)
    this.setState({
      textRadius,
      maxChildWidth,
      draggedChild: {
        _id,
        linkType: child.linkType,
        linkName: child.linkName,
        x: coords.x,
        y: coords.y,
        cursorX,
        cursorY,
        dragMode: 'reorder',
        position: { ...coords },
      },
    })
  }
  childIndex = (nodesOnSide: NodePosition[], side: string, y: number) => {
    let index = 0
    let length = nodesOnSide.length

    nodesOnSide = nodesOnSide.sort((a, b) => {
      return a.y - b.y
    })

    for (let i = 0; i < length; i++) {
      const node = nodesOnSide[i]
      const nextNode = nodesOnSide[i + 1]
      const previousNode = nodesOnSide[i - 1]
      let offset = 0

      if (nextNode) {
        offset = (nextNode.y - node.y) / 2
      } else if (previousNode) {
        offset = (node.y - previousNode.y) / 2
      }

      if (y > (node.y - offset)) {
        index = i
      } else {
        break
      }
    }

    if (index > nodesOnSide.length - 1) {
      index = nodesOnSide.length - 1
    }

    return index
  }
  // TODO: remove or document the special ids used when dragging
  normalizeDragId = (id: string) => {
    if (id.includes('-drag')) {
      return id.slice(0, id.indexOf('-drag', -1))
    }

    return id
  }
  childDragged = (_rawId: string, x: number, y: number, cursorX: number, cursorY: number) => {
    if (!_rawId.endsWith('-drag')) {
      return
    }

    let _id = this.normalizeDragId(_rawId)

    const singleNodeView = this.props.singleNodeView && this.props.singleNodeViewPrepared
    const totalX = this.state.draggedChild.x + x
    const totalY = this.state.draggedChild.y + y
    const nodeSide = this.nodePositions[_id].side
    let sideOn = nodeSide

    const mouseRadius = pythagorean(Math.abs(totalX), Math.abs(totalY))

    let textRadius = this.state.textRadius

    // Text radius is used to know when to switch from reordering to expanding
    if (singleNodeView) {
      textRadius = this.props.radius + 100
    } else if (nodeSide === 'top') {
      // Reordering is disabled for miniclusters
      // so we can switch to expanding quicker
      textRadius = this.props.radius + 50
    } else if (Math.abs(totalY) > this.props.radius + 10) {
      // Since there are no children to reorder above or below the node,
      // the textRadius is decreased so it will switch to expand quicker.
      textRadius = this.props.radius
    } else if (nodeSide === 'right' && totalX < 0) {
      // When calculating the drag mode, the position of the child's circle is used.
      // If the child is dragged to the other side, the circle is on the wrong side
      // and it switches to expand early. This and the next else-if block
      // fixes it by increasing the textRadius in that situation.
      sideOn = 'left'
      textRadius += this.state.maxChildWidth
    } else if (nodeSide === 'left' && totalX > 0) {
      sideOn = 'right'
      textRadius += this.state.maxChildWidth
    }

    const dragMode = this.props.dragLinkMode
      ? 'link'
      : Math.abs(mouseRadius) < textRadius
        ? 'reorder'
        : 'expand'

    // Needed for reorder mode
    const leftNodes: NodePosition[] = []
    const rightNodes: NodePosition[] = []
    let index = -1

    Object.values(this.nodePositions).forEach(position => {
      if (position.node._id === _id) {
        return
      }
      if (position.side === 'left') {
        leftNodes.push(position)
      } else {
        rightNodes.push(position)
      }
    })

    if (sideOn === 'left') {
      index = this.childIndex(leftNodes, sideOn, totalY)
    } else {
      index = this.childIndex(rightNodes, sideOn, totalY) + Math.ceil(this.props.nodes.length / 2)
    }

    // Needed for expand mode
    const angle = circleTop0(Math.atan2(totalY, totalX))
    const quadrant = closestQuadrant(radiansToDegrees(angle), this.props.openExpandPositions)

    this.setState({
      draggedChild: {
        ...this.state.draggedChild,
        x: totalX,
        y: totalY,
        cursorX,
        cursorY,
        dragMode,
        quadrant,
        reorderedIndex: index,
        reorderedSide: sideOn,
      },
    })
  }
  childDragStopped = (_rawId: string) => {
    const _id = this.normalizeDragId(_rawId)
    if (this.state.draggedChild.dragMode === 'expand') {
      this.expandChildFromDrag(_id)
    } else {
      this.props.addReorderedRelative(this.props.parentId, _id, this.state.draggedChild.reorderedIndex, this.state.draggedChild.reorderedSide)
    }
    this.props.childDragStopped({ ...this.state.draggedChild, parentId: this.props.parentId })
    this.setState({
      draggedChild: {
        _id: null,
        x: 0,
        y: 0,
        dragMode: null,
      },
    })
    this.props.draggingChild(false)
  }
  expandChildFromDrag(_id: string) {
    const node = this.nodePositions[_id].node
    this.props.exploreNode(_id, node.title, this.props.parentId, degreesToRadians(this.state.draggedChild.quadrant))
  }

  // TODO: check if this is still needed
  getDefaultFocusChildNode = (nodePositions: NodePosition[], next?: boolean) => {
    const isSingleNodeView = this.props.singleNodeView && this.props.singleNodeViewPrepared
    let middle = Math.ceil(nodePositions.length / 2)
    let leftNodes = nodePositions.slice(0, middle)
    let index = nodePositions.findIndex(position => position.node._id === leftNodes[leftNodes.length - 1].node._id)

    if (isSingleNodeView) {
      if (next) {
        index = 0
      } else {
        index = nodePositions.length - 1
      }
    }

    let x = this.props.radius * Math.cos(nodePositions[index].angle + 0.074)
    let y = this.props.radius * Math.sin(nodePositions[index].angle + 0.074)

    return { ...nodePositions[index].node, x, y, focused: true }
  }

  // TODO: check if this is still needed
  focusNextChild = () => {
    let nodePositions: NodePosition[] = []
    const isSingleNodeView = this.props.singleNodeView && this.props.singleNodeViewPrepared
    if (isSingleNodeView) {
      // TODO: make the child a consistent type
      nodePositions = singleNodeViewPositions(this.props.nodes.slice(), this.props.radius, this.state.scrollPosition, this.props.focusedChild)
    } else {
      // TODO: check why focusedNode is treated as a string here
      nodePositions = orbitPositions(this.props.nodes.slice(), this.props.focusedChild as any)
    }
    let focusedChild = null
    if (nodePositions.length > 0) {
      if (this.props.focusedChild) {
        let currentIndex = nodePositions.findIndex(child => child.node._id === this.props.focusedChild._id)
        if (currentIndex !== -1 && currentIndex >= 0 && currentIndex < nodePositions.length - 1) {
          const index = currentIndex + 1
          let x = this.props.radius * Math.cos(nodePositions[index].angle + 0.074)
          let y = this.props.radius * Math.sin(nodePositions[index].angle + 0.074)
          focusedChild = { ...nodePositions[index].node, x, y, focused: true }
        }
      } else {
        focusedChild = this.getDefaultFocusChildNode(nodePositions, true)
      }
      this.props.onFocusedChild({ ...focusedChild, forward: true })
    }
  }

  // TODO: check if this is still needed
  focusPreviusChild = () => {
    let nodePositions: NodePosition[] = []
    const isSingleNodeView = this.props.singleNodeView && this.props.singleNodeViewPrepared
    if (isSingleNodeView) {
      // TODO: fix inconsistent type
      nodePositions = singleNodeViewPositions(this.props.nodes.slice(), this.props.radius, this.state.scrollPosition, this.props.focusedChild)
    } else {
      // TODO: check why focusedChild is treated as a string here
      nodePositions = orbitPositions(this.props.nodes.slice(), this.props.focusedChild as any)
    }
    let focusedChild = null
    if (nodePositions.length > 0) {
      if (this.props.focusedChild) {
        let currentIndex = nodePositions.findIndex(child => child.node._id === this.props.focusedChild._id)
        if (currentIndex !== -1 && currentIndex > 0) {
          const index = currentIndex - 1
          let x = this.props.radius * Math.cos(nodePositions[index].angle + 0.074)
          let y = this.props.radius * Math.sin(nodePositions[index].angle + 0.074)
          focusedChild = { ...nodePositions[index].node, x, y, focused: true }
        }
      } else {
        focusedChild = this.getDefaultFocusChildNode(nodePositions)
      }
      this.props.onFocusedChild(focusedChild)
    }
  }

  render() {
    let radius = this.props.radius
    const relatives = this.props.nodes.slice()
    const {
      draggedChild,
    } = this.state
    const activePropertyIds = this.props.activeProperties.map(property => property._id)
    const relativesLoading = this.props.relativesLoading
    const focusedNode = this.props.focusedNode
    const preLoad = this.props.preLoad

    if (typeof draggedChild.reorderedIndex === 'number' && draggedChild.position.side !== 'top') {
      let moveFrom = -1
      let moveTo = draggedChild.reorderedIndex

      for (let i = 0; i < relatives.length; i++) {
        if (relatives[i]._id === draggedChild._id) {
          moveFrom = i
          break
        }
      }

      if (draggedChild.dragMode === 'expand') {
        moveTo = moveFrom
      }

      relatives.splice(moveFrom, 1)
      // TODO: find a way to avoid mixing types
      relatives.splice(moveTo, 0, (({ hint: true } as unknown) as Relative))
    }
    
    let positions: NodePosition[]
    if (this.state.noChildren || relatives.length === 0) {
      // For the fade in animation to work when toggling single node view
      // we need react to recreate the dom elements.
      positions = []
    } else if (this.props.singleNodeView && this.props.singleNodeViewPrepared) {
      positions = singleNodeViewPositions(relatives, this.props.radius, this.state.scrollPosition, (this.props.focusedChild as any))
    } else {
      positions = orbitPositions(relatives, (this.props.focusedChild as any))
    }

    if (draggedChild.dragMode !== null) {
      positions.push({
        ...draggedChild.position,
        dragged: true,
      })
    }

    const nodePositions: {[index: string]: NodePosition} = {}

    let gatewayLines: ReactElement[] = []

    let firstNodeY = 0
    let verticalSpaceBetween = 0
    let draggingPos = -1
    let hintPos = -1

    let nodes = positions.map((position: NodePosition, i: number) => {
      let dragProps = {
        detectDragOnly: true,
        dragging: false,
        dragPos: {
          x: 0,
          y: 0
        }
      }
      // The angle seems to be 0.074 radians off of being square
      let x = radius * Math.cos(position.angle + 0.074)
      let y = radius * Math.sin(position.angle + 0.074)
      // TODO: node should not be mutated here
      position.node.angle = circleTop0(position.angle + 0.074)

      nodePositions[position.node._id] = { ...position, x, y }

      // TODO: find a different place to track nodes that are hints
      if ((position.node as any).hint) {
        if (draggedChild.dragMode === 'reorder'
        ) {
          hintPos = i
          return (
            <DragReorderHint
              key='hint'
              x={x}
              y={y}
              side={position.side}
            />
          )
        } else {
          return null
        }
      }

      if (position.dragged) {
        x = draggedChild.x
        y = draggedChild.y

        draggingPos = i

        dragProps = {
          detectDragOnly: false,
          dragging: true,
          dragPos: {
            x: draggedChild.cursorX,
            y: draggedChild.cursorY,
          },
        }
      } else if (position.node._id === draggedChild._id) {
        draggingPos = i
      }

      if ((position.node.gateway === true) && (!position.dragged || draggedChild.dragMode === 'reorder')) {
        let stopY = y

        let { x: startX, y: startY } = circlePointFromAngle(position.angle, this.props.centerRadius)

        gatewayLines.push(
          <Line
            key={position.node.angle}
            startID={this.props.parentId}
            stopID={position.node._id}
            showPreview={this.props.showLinkPreview}
            startX={startX}
            stopX={x}
            startY={startY}
            stopY={stopY}
          />
        )
      }

      if (i === 0) {
        firstNodeY = y
      } else if (i === 1) {
        verticalSpaceBetween = firstNodeY - y
      }
      let properties: FocusedNodeProperty[] = []

      if (this.props.properties && this.props.properties[position.node._id]) {
        properties = this.props.properties[position.node._id].properties
          .filter(property => activePropertyIds.includes(property._id))
          .map(property => {
            return {
              ...property,
              color: this.props.activeProperties.find(activeProperty => activeProperty._id === property._id).color,
            }
          })
      }

      return (
        <Child
          key={position.node._id + (position.dragged ? '-drag' : '') + (position.node.miniCluster ? '-mini' : '')}
          isCluster={isCluster(position.node)}
          dragId={position.node._id + (position.dragged ? '-drag' : '')}
          x={x}
          y={y}
          showMenu={this.props.showMenu}
          menuOpenFor={this.props.menuOpenForChild === position.node._id}
          openMenu={this.props.openMenuFor === position.node._id}
          dragPosChanged={this.childDragged}
          dragStarted={this.childDragStarted}
          dragStopped={this.childDragStopped}
          node={position.node}
          side={position.side}
          parentTitle={this.props.parentTitle}
          maxTitleLength={position.side === 'left' ? this.props.leftMaxTitleLength : this.props.rightMaxTitleLength}
          faded={this.props.singleNodeView && position.faded}
          dragging={dragProps.dragging}
          dragPos={dragProps.dragPos}
          detectDragOnly={dragProps.detectDragOnly}
          singleNodeView={this.props.singleNodeView}
          dragEnabled={!position.node.miniCluster && this.props.focusedNode}
          properties={properties}
        />
      )
    })

    if (draggingPos > -1 && draggedChild.dragMode === 'reorder') {
      // Move child to last position so it is on top
      const child = nodes.splice(draggingPos, 1)
      nodes.push(child[0])
    }

    if (hintPos > -1) {
      const hint = nodes.splice(hintPos, 1)
      nodes.unshift(hint[0])
    }

    this.nodePositions = nodePositions

    const visibleHeight = nodes.length === this.props.nodes.length ? this.props.nodes.length * verticalSpaceBetween * 2 : positions.length * verticalSpaceBetween
    const childrenLength = this.props.nodes.length
    const key = `${childrenLength}-${radius}`
    let scrollData
    if (key in this.cachedScrollNumbers) {
      scrollData = this.cachedScrollNumbers[key]
    } else {
      scrollData = {
        visibleHeight,
        height: this.props.nodes.length * verticalSpaceBetween,
      }
      if (!this.state.noChildren) {
        this.cachedScrollNumbers = {
          [key]: scrollData,
        }
      }
    }
    let classNames = 'node__orbit '

    let orbitStyle = {
      color: 'rgba(256, 256, 256, 0.3)',
      width: 1,
    }
    if (this.props.showTargetLinkNode) {
      orbitStyle = { color: '#19B7D8', width: 2 }
    }
    if (this.props.visible) {
      classNames += 'node__orbit--visible '
    } else {
      classNames += 'node__orbit--hidden '
    }
    if ((this.props.singleNodeView && !this.props.singleNodeViewPrepared) || this.props.showTargetLinkNode) {
      classNames += 'node__orbit--hide-children '
    }
    if (this.state.disableAnimations) {
      classNames += 'node__orbit--disable-animations '
    }

    return (
      <OrbitWrapper
        transform='translate(0, 0)'
        className={classNames}
        initialAppear={this.props.initialAppear}
      >
        {focusedNode ? (relativesLoading) ? (preLoad) ? <React.Fragment>
          <circle
            r={100}
            style={{ transform: `scale(${this.props.radius / 100}, ${this.props.radius / 100}` }}
            strokeWidth={orbitStyle.width}
            fill='none'
            stroke={this.props.color} /><ColorCircularProgress variant='indeterminate' />
        </React.Fragment> : <ColorCircularProgressStatic variant='static' value={75} /> : <React.Fragment>
          <circle
            r={100}
            style={{ transform: `scale(${this.props.radius / 100}, ${this.props.radius / 100}` }}
            strokeWidth={orbitStyle.width}
            fill='none'
            stroke={this.props.color} /></React.Fragment> : <React.Fragment><circle r={100} style={{ transform: `scale(${this.props.radius / 100}, ${this.props.radius / 100}` }} strokeWidth={orbitStyle.width} fill='none' stroke={this.props.color} /></React.Fragment>}
        {gatewayLines}

        {this.state.draggedChild.dragMode === 'expand' &&
          <DragExpandHint
            isCluster={isCluster(this.state.draggedChild.position.node)}
            x={0}
            y={0}
            downText={getUpDownText(this.state.draggedChild.linkType, this.state.draggedChild.linkName).down}
            quadrant={this.state.draggedChild.quadrant}
            radius={this.props.radius}
            centerRadius={this.props.centerRadius}
          />
        }
        <OrbitActions
          orbitRadius={radius}
          menuOpen={this.props.menuOpenForChild || this.props.menuOpen}
          showSingleNodeView={this.showSingleNodeView}
          isChildren={this.props.nodes && this.props.nodes.length > 0}
          showAddButton={this.props.showAddButton}
          addNode={() => this.props.showNodeCreationWindow(this.props.parentId)}
          isCluster={this.props.parentCluster}
          toggleClusterState={() => this.props.toggleClusterState(this.props.parentId)}
        />
        {nodes}
        {this.props.singleNodeView && this.props.singleNodeViewPrepared && positions.length < this.props.nodes.length &&
          <CurvedScrollBar
            nodes={nodes}
            focusedChild={this.props.focusedChild}
            overlayOpen={this.props.overlayOpen}
            onChange={this.updateScrollPosition}
            radius={this.props.radius - 40}
            height={scrollData.height}
            scrollTop={this.state.scrollPosition}
            visibleHeight={scrollData.visibleHeight} />}
      </OrbitWrapper>
    )
  }
  shouldComponentUpdate(newProps: Props) {
    if (
      !this.props.visible &&
      !newProps.visible &&
      !newProps.orbitLocked &&
      !this.props.singleNodeView
    ) {
      return false
    }

    return true
  }
  componentWillReceiveProps(newProps: Props) {
    if (newProps.singleNodeView && !this.props.singleNodeView) {
      this.setState({
        scrollPosition: 0,
        disableAnimations: false,
      })
      this.props.focusChild && this.props.onFocusedChild(null)
    } else if (!newProps.singleNodeView && this.props.singleNodeView) {
      this.props.focusChild && this.props.onFocusedChild(null)
      this.setState({
        disableAnimations: false,
      })
    }
    if (newProps.singleNodeViewPrepared !== this.props.singleNodeViewPrepared) {
      this.setState({
        noChildren: true,
        disableAnimations: false,
      })
      setTimeout(() => {
        this.setState({
          noChildren: false,
        })
      }, 500)
      setTimeout(() => {
        this.setState({
          disableAnimations: true,
        })
      }, 1500)
    }
    if (newProps.visible) {
      // TODO: check if it is .id or ._id
      if ((!this.props.focusChild && newProps.focusChild) || (newProps.focusChild && (newProps.focusChild as any).id !== (this.props.focusChild as any).id)) {
        const isSingleNodeView = this.props.singleNodeView && this.props.singleNodeViewPrepared
        // TODO: check if focusing children is still used
        // TODO: find where direction is coming from
        switch ((newProps.focusChild as any).direction) {
          case ESCAPE:
            this.props.onFocusedChild(null)
            break
          // no default
        }
      }
    }
  }
}
