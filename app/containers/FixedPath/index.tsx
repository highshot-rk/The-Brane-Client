import {
  addLink,
  addNode,
  addReorderedRelative,
  animateBranchCollapse,
  collapseBranch,
  expandBranch,
  focusNode,
  hideBranchPipeline,
  hideMenu,
  hideSingleNodeView,
  showBranchPipeline,
  showMenu,
  showSingleNodeView,
  singleNodeViewReady,
  toggleOrbitLock,
  toggleClusterState,
  selectMiniCluster,
  childrenPreLoaded,
} from './actions'
import { addProfileNode, showNodeCreationWindow, showLinkCreationWindow } from 'containers/HomePage/actions'
import { walkBranch } from 'utils/fixed-path'
import layout,
{
  GRID_SPACING,
  findNodeOnLeft,
  findNodeOnRight,
  nodePos,
  orbitVisible,
} from './layout'
import {
  selectAnimationData,
  selectBranchPipeline,
  selectRelatives,
  selectFocusedNode,
  selectMenu,
  selectOpenMenuFor,
  selectNodes,
  selectReorderedRelatives,
  selectSingleNodeView,
  selectZoomValue,
  selectCenterOnFocused,
  selectOpenLPWfor,
  selectFocusChild,
  selectMiniClusters,
  selectExpandedMiniClusters,
  selectPreLoaded,
  selectLoadingRelativesFor,
} from 'containers/FixedPath/selectors'

import {
  selectTagFilters,
  selectFilterWithin,
  selectShowOnOrbit,
} from 'containers/FilterMenu/selectors'

import BranchPipeline from 'components/BranchPipeline'
import Line from 'components/Line'
import Menu from 'components/NodeMenu'
import Node, { NodeAnimationConfig } from 'components/Node'
import NodeMenuOverlay from 'components/NodeMenuOverlay'
import React, { Component } from 'react'
import { compressedLayout } from './compressedLayout'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { show as showNodePreview, hide as hideNodePreview } from 'containers/NodePreviewWindow/actions'
import { showPreview as showLinkPreview, hidePreview as hideLinkPreview } from 'containers/LinkPreviewWindow/actions'
import {
  selectSidebarMenu,
  selectNodeCreationWindow,
  selectLinkCreationWindow,
  selectNodeEditWindow,
  selectLinkEditWindow,
  selectWelcome,
} from 'containers/HomePage/selectors'
import {
  selectAuth,
} from 'containers/Auth/selectors'
import { selectShowNodePreviewWindow } from 'containers/NodePreviewWindow/selectors'
import LinkCreationOptionsDialog from 'components/LinkCreationOptionsDialog'
import Welcome from 'components/Welcome'
import { confirmRestorePath } from 'containers/LineageTool/actions'
import { BRANE_NODE_ID, VENN_ID } from '../../constants'
import { selectFocusedNodeProperties, selectActiveProperties } from 'containers/PropertySidebar/selectors'
import {
  Node as NodeType,
  SourceNode,
  LayoutLink,
  SourceNodeMap,
  Quadrant,
  NodeAnimation,
  PathAnimation,
  ReorderedRelative,
  LinkAnimationType,
  NodeMenuConfig,
  TagPath,
  ShowOnOrbit,
  ExpandedMiniClusters,
  SideStatus,
  Relative,
  RelativeMap,
} from './types'
import { ActiveProperty, FocusedNodeProperties } from 'containers/PropertySidebar/types'
import { getData } from 'utils/injectData'
import { trackEvent } from 'utils/analytics'

export const SMALL_NODE_RADIUS = 45
export const LARGE_NODE_RADIUS = 65

const EXIT_STAGE_FADE = 0
const EXIT_STAGE_REARRANGE = 1

const HIDE_SNV_MS = 1500

type SingleNodeViewState = {
  show: boolean,
  prepared: boolean,
  _id: string,
}

type EditableLink = {
  parentId: string,
  _id: string,
  title: string,
}

type TargetLinkNode = {
  _id: string,
  title: string,
};

type BranchCollapseAnimation = Array<{
  _id: string,
  index?: number,
  type?: 'hide',
  title?: string,
  delay?: number,
}>

type Props = {
  // Technically nodes start as NodeType, but are
  // mutated when generating the layout to become SourceNode
  // TODO: do not mutate. It currently is done for performance reasons
  // but it should be possible once the reducer is split up.
  nodes: { [index: string]: NodeType },

  focusedNode: NodeType,
  menu: NodeMenuConfig,
  openMenuFor: string,
  reorderedRelatives: {[index: string]: ReorderedRelative[]},
  showMenu: Function,
  addNode: Function,
  focusNode: Function,
  expandBranch: (id: string, angle: number) => void,
  addLink: Function,
  hideSingleNodeView: () => void,
  singleNodeView: SingleNodeViewState,
  showNodePreview: Function,
  hideBranchPipeline: Function,
  animateBranchCollapse: Function,
  collapseBranch: Function,
  showLinkCreationWindow: Function,
  showSingleNodeView: Function,
  animationData: PathAnimation,
  showLinkPreview: Function,
  tagFilters: Array<TagPath>,
  filterWithin: string,
  sidebarMenu: string | null,
  showBranchPipeline: Function,
  addProfileNode: Function,
  hideMenu: () => void,
  toggleOrbitLock: Function,
  confirmRestorePath: Function,
  overlayOpen: boolean,
  hideNodePreviewWindow: Function,
  hideLinkPreviewWindow: Function,
  showNodeCreationWindow: Function,
  singleNodeViewReady: () => void,
  addReorderedRelative: Function,
  focusChild: string,
  welcome: boolean,
  auth?: {
    firstName: String,
  },
  zoomValue: number,
  branchPipeline: {
    show: boolean,
    id: string,
  },
  relatives: {
    [index: string]: RelativeMap
  },
  centerOnFocused: number,
  openLPWfor: any,
  toggleClusterState: Function,
  showOnOrbit: ShowOnOrbit,
  miniClusters: boolean,
  expandedMiniClusters: ExpandedMiniClusters,
  selectMiniCluster: Function,
  focusedNodeProperties: FocusedNodeProperties,
  activeProperties: ActiveProperty[],
  loadingRelativesFor: string | null,
  preLoaded: boolean,
}

type State = {
  sourceNodes: SourceNodeMap,
  losingFocus: boolean,
  // TODO: fix inconsistent data type
  draggingChild: string | boolean,
  x: number,
  y: number,
  dragging: boolean,
  focusedChild: SourceNode,
  targetLinkNode: TargetLinkNode,
  layoutNodes: Array<SourceNode>,
  links: Array<LayoutLink>,
  showLinkCreationDialog: {
    target: TargetLinkNode,
    draggedChild: EditableLink,
  } | null,
  followingNodeAnimation: boolean,
  staggeredIndex: number,
  positions: SourceNodeMap,
  exitingSingleNodeView: number,
}

const backgrounds = {
  sandbox: require('./backgrounds/sandbox.jpg'),
  public: require('./backgrounds/public.jpg'),
  memorial: require('./backgrounds/memorial.jpg'),
  corona: require('./backgrounds/Mask light.png'),
}

const backgroundName = getData('background') as keyof typeof backgrounds
const background = backgrounds[backgroundName] || backgrounds.public

export class FixedPath extends Component<Props, State> {
  constructor (props: Props) {
    super(props)

    let layoutData = this.updateLayout(
      this.props.nodes,
      this.props.relatives,
      this.props.focusedNode
    )

    this.state = {
      ...layoutData,
      dragging: false,
      followingNodeAnimation: false,
      staggeredIndex: 0,
      exitingSingleNodeView: -1,
      losingFocus: false,
      draggingChild: null,
      focusedChild: null,
      targetLinkNode: null,
      showLinkCreationDialog: null
    }
  }

  updateTransformTimeout: ReturnType<typeof setTimeout> = null
  finishedAnimationId = -1
  isMouseDown = false
  mouseStart = { x: 0, y: 0 }
  prevMousePos = { x: 0, y: 0 }
  dragging = false

  /**
   * Called by children when a parent or child node is clicked.
   * If it is a child, it will
   *  - if it is a gateway, focus the expanded node it links to
   *  - otherwise open the menu for the child node
   * If it is a parent, it will
   * - If the parent is focused, open the menu
   * - Otherwise it will focus the parent
   * @param {any} node
   * @param {any} x
   * @param {any} y
   * @param {any} isChild
   * @param {any} parentId
   * @param {any} angle
   *
   * @memberOf FixedPath
   */
  nodeClicked = (node: Relative, x: number, y: number, isChild: boolean, parentId: string, angle: Quadrant, enterEvent: boolean) => {
    if (this.props.menu) {
      this.props.hideMenu()
    } else if (enterEvent === true && this.state.focusedChild) {
      // If child node is focused in the orbit
      const child = this.state.focusedChild
      this.props.showMenu(child, child.x, child.y, true, parentId)
    } else if (node.gateway === true && isChild && !this.isCollapsed(node._id)) {
      // bypasses menu and focuses node
      this.exploreNode(node._id, node.title, parentId, angle)
    } else if (this.isCollapsed(node._id) && this.state.sourceNodes[node._id].outgoing.length > 0) {
      // is a collapsed branch. Open branch pipeline
      this.props.showBranchPipeline(node._id)
    } else if (!isChild && node._id !== this.props.focusedNode._id) {
      // Menu is only opened for parent nodes when they are focused
      // The node gets focused instead
      this.exploreNode(node._id, node.title, parentId, angle)
    } else {
      this.props.showMenu(node, x, y, isChild, parentId, node.angle || angle)
    }
  }
  isCollapsed = (id: string) => {
    let node = this.state.sourceNodes[id]
    if (!node || id === '0' || node.originallyFrom === undefined) {
      return node && node.collapsed
    }
    return this.state.sourceNodes[node.originallyFrom].relatives[id].collapsed
  }
  exploreNode = (id: string, title: string, sourceNode: string, angle: number) => {
    let action: Function

    // angle is in radians. convert to degrees
    angle = (angle) * (180 / Math.PI) % 360
    if (angle < 0) {
      angle = 360 + angle
    }

    if (sourceNode === VENN_ID && id !== VENN_ID) {
      const parent = this.state.sourceNodes[sourceNode]
      let child = parent.relatives[id]
      action = () => { this.props.addNode({ id, title: child.title, _type: child._type }, sourceNode, angle) }
      trackEvent('explore-node', { action: 'add-venn-relative'});
    } else if (this.props.nodes[id]) {
      // Node is already on the fixed path
      // TODO: remove commented out code
      let isCollapsed = this.isCollapsed(id) // this.state.sourceNodes[this.state.sourceNodes[id].originallyFrom].children[id].collapsed
      let isLinked = sourceNode in this.props.nodes[id].from ||
        id in this.props.nodes[sourceNode].from

      if (id === sourceNode) {
        // Focusing expanded node from menu for node
        trackEvent('explore-node', { action: 'focus-self' });
        action = () => this.props.focusNode(id)
      } else if (isCollapsed) {
        // The source is collapsed, either by the user or
        // from lack of space around the node to show all expanded relatives
        action = () => this.props.expandBranch(id, angle)
        trackEvent('explore-node', { action: 'expand-branch' });
      } else if (isLinked) {
        action = () => this.props.focusNode(id)
        trackEvent('explore-node', { action: 'focus-linked-node' });
      } else {
        action = () => this.props.addLink(sourceNode, id, this.props.nodes[sourceNode].title)
        trackEvent('explore-node', { action: 'add-link' });
      }
    } else {
      // TODO: this should get children from sourceNodes instead
      const _type = (this.props.nodes[sourceNode] as SourceNode).relatives[id]._type
      action = () => this.props.addNode({ id, title, _type }, sourceNode, angle)
      trackEvent('explore-node', { action: 'add-node' });
    }

    if (this.props.singleNodeView.show) {
      this.props.hideSingleNodeView()
      setTimeout(() => {
        this.setState({
          losingFocus: false,
        })
        action()
      }, HIDE_SNV_MS)
      this.setState({
        losingFocus: true,
      })
    } else {
      action()
    }
  }
  expandBranch = (id: string, angle: number) => {
    if (this.props.singleNodeView.show) {
      this.props.hideSingleNodeView()
      this.setState({
        losingFocus: true,
      })
      setTimeout(() => {
        this.props.expandBranch(id, angle)
        this.setState({
          losingFocus: false,
        })
      }, HIDE_SNV_MS)
    } else {
      this.props.expandBranch(id, angle)
    }
  }
  previewNode = (nodeId: string) => {
    this.props.showNodePreview(nodeId)
  }
  onMouseOverNode = (e: MouseEvent, targetLinkNode: SourceNode) => {
    // TODO: remove need for type assertion
    if (this.state.draggingChild && !targetLinkNode.relatives[(this.state.draggingChild as string)]) {
      this.setState({ targetLinkNode })
    }
  }

  onMouseLeaveNode = () => {
    if (this.state.draggingChild && this.state.targetLinkNode) {
      this.setState({ targetLinkNode: null })
    }
  }

  // TODO: add types
  hideBranchPipeline = (...props: any) => {
    if (this.props.singleNodeView.show && props.length > 0) {
      this.props.hideSingleNodeView()
      setTimeout(() => {
        this.props.hideBranchPipeline(...props)
      }, 1200)
    } else {
      this.props.hideBranchPipeline(...props)
    }
  }
  collapseBranch = (id: string) => {
    // First animate branch collapsing
    let animateData: BranchCollapseAnimation = []
    let maxIndex = 0

    // Only animate the nodes on screen.
    // Instead of finding each node that is visible, we guess
    // at how many could be, and limit our animations to that many
    // nodes after the starting node
    let nodeMaxDistanceFromWindow = {
      x: Math.max(Math.abs(-1 * this.state.x - this.state.sourceNodes[id].x), Math.abs(-1 * this.state.x + window.innerWidth - this.state.sourceNodes[id].x)),
      y: Math.max(Math.abs(-1 * this.state.y - this.state.sourceNodes[id].y), Math.abs(-1 * this.state.y + window.innerHeight - this.state.sourceNodes[id].y)),
    }

    let maxStaggerIndex = Math.floor(Math.min(nodeMaxDistanceFromWindow.x / GRID_SPACING.x, nodeMaxDistanceFromWindow.y / GRID_SPACING.y))
    walkBranch({
      startId: id,
      nodes: this.state.sourceNodes,
      skipCollapsed: true,
    }, (nodeId: string, index: number) => {
      maxIndex = index > maxIndex ? index : maxIndex

      animateData.push({
        _id: nodeId,
        index: index,
      })
    })

    animateData = animateData.map((data) => {
      let delay
      if (data.index > maxStaggerIndex) {
        delay = 0
      } else {
        delay = (maxStaggerIndex - data.index) * 250
      }
      return {
        _id: data._id,
        type: 'hide',
        // TODO: find where title is used
        title: this.props.nodes[data._id].title,
        delay: delay,
      }
    })

    // only animate if it is a branch
    if (maxIndex > 0) {
      this.props.animateBranchCollapse(this.state.sourceNodes[id].originallyFrom, animateData)

      // After the animation finished, mark the branch as collapse and focuse it's parent
      setTimeout(() => {
        this.props.collapseBranch(id, this.state.sourceNodes[id].originallyFrom)
      }, maxIndex * 250 + 500)
    } else {
      this.props.collapseBranch(id, this.state.sourceNodes[id].originallyFrom)
    }
  }
  mouseDown = (e: React.MouseEvent) => {
    this.isMouseDown = true
    this.mouseStart = {
      x: e.pageX,
      y: e.pageY,
    }
  }
  mouseMove = (e: React.MouseEvent) => {
    if (
      this.state.draggingChild ||
      this.props.singleNodeView.show ||
      !this.isMouseDown ||
      this.props.menu !== null
    ) {
      this.isMouseDown = false
      return
    }

    if (this.dragging) {
      this.setState({
        dragging: true,
        x: this.state.x + e.pageX - this.prevMousePos.x,
        y: this.state.y + e.pageY - this.prevMousePos.y,
      })
    } else if (
      Math.abs(this.mouseStart.x - e.pageX) > 5 ||
      Math.abs(this.mouseStart.y - e.pageY) > 5
    ) {
      this.dragging = true
    }

    this.prevMousePos = {
      x: e.pageX,
      y: e.pageY,
    }
  }
  mouseUp = () => {
    this.isMouseDown = false
    this.dragging = false
    this.setState({
      dragging: false,
    })
  }
  draggingChild = (isDragging: boolean) => {
    this.setState({
      draggingChild: isDragging,
    })
  }
  onFocusedChild = (focusedChild: SourceNode) => {
    this.setState({
      focusedChild,
    })
  }
  childDragStopped = ({ position: { node: draggedChild }, parentId }: any) => {
    draggedChild = { ...draggedChild, parentId }
    const target = this.state.targetLinkNode
    if (target && draggedChild) {
      this.setState({ targetLinkNode: null, showLinkCreationDialog: { draggedChild, target } })
    }
  }
  handleConfirmLinkCreationDialog = (button: string | number) => {
    const { target, draggedChild } = this.state.showLinkCreationDialog
    const targetName = target.title
    const draggedChildName = draggedChild.title
    const parentLink: any = {
      text: targetName,
      node: target,
      isParent: true,
      linkType: null,
    }
    const childLink: any = {
      text: draggedChildName,
      category: {
        t: draggedChildName,
        ...draggedChild,
      },
      isParent: false,
      linkType: null,
    }
    const replace = {
      from: draggedChild.parentId,
      to: draggedChild._id,
    }
    switch (button) {
      case 'Cancel':
        return this.setState({
          showLinkCreationDialog: null,
        })
      case 1:
        this.props.showLinkCreationWindow(parentLink, childLink)
        return this.setState({
          showLinkCreationDialog: null,
        })
      case 2:
        this.props.showLinkCreationWindow(parentLink, childLink, replace)
        return this.setState({
          showLinkCreationDialog: null,
        })
    }
  }
  showSingleNodeView = (_id: string) => {
    const animationData: NodeAnimation[] = []
    let nodes = this.state.layoutNodes
    nodes.forEach((node) => {
      if (node._id === _id) {
        return
      }

      animationData.push({
        _id: node._id,
        delay: 0,
        type: 'hide',
      })
    })

    this.props.showSingleNodeView(_id, animationData)
  }
  sortAnimationNodes = () => {
    let animationNodeData = this.props.animationData.nodes
    let keys = Object.keys(animationNodeData)
    if (keys.length === 0) {
      return []
    }
    let sorted = Object.keys(animationNodeData).map((key) => {
      return {
        _id: key,
        ...animationNodeData[key],
      }
    }).sort((a, b) => {
      return a.delay - b.delay
    })

    let lastDelay = sorted[sorted.length - 1].delay
    let target = this.props.focusedNode._id
    sorted = sorted.filter((data) => {
      if (data.delay !== lastDelay) {
        return true
      }
      if (data._id === target) {
        return true
      }
      return false
    })
    return sorted
  }
  menuOverflow = (menuY: number) => {
    if (!this.props.singleNodeView.show) {
      return 'none'
    }

    const menuRadius = 80
    const minY = -1 * this.state.y + menuRadius
    const maxY = -1 * this.state.y + document.body.scrollHeight - menuRadius

    if (menuY < minY) {
      return 'top'
    }
    if (menuY > maxY) {
      return 'bottom'
    }
    return 'none'
  }
  showLinkPreview = (startId: string, stopId: string) => {
    // Make sure the stopId is a child of startId since sometimes they are reversed
    if (this.props.relatives[startId] && this.props.relatives[startId][stopId] && this.props.relatives[startId][stopId].linkDirection === 'child') {
      this.props.showLinkPreview(startId, stopId)
    } else {
      this.props.showLinkPreview(stopId, startId)
    }
  }

  showPreview = (nodeId: string) => {
    this.props.showNodePreview(nodeId)
    this.props.hideMenu()
  }

  render () {
    const filters = this.props.tagFilters.length > 0 ? {
      within: this.props.filterWithin,
      tagFilters: this.props.tagFilters,
    } : null
    const singleNodeViewReady = this.props.singleNodeView.show && this.props.singleNodeView.prepared

    let menuPos = { x: 0, y: 0, index: -1 }
    let cords = { x: this.state.x, y: this.state.y }

    let animationNodeData = this.props.animationData.id > this.finishedAnimationId ? this.props.animationData.nodes : {}
    if (!(this.state.exitingSingleNodeView > -1)) {
      this.finishedAnimationId = this.props.animationData.id
    }

    let sortedAnimationNodes = []
    if (this.state.followingNodeAnimation) {
      sortedAnimationNodes = this.sortAnimationNodes()

      let tempFocusedId = sortedAnimationNodes[this.state.staggeredIndex]._id
      cords = this.findCoords(tempFocusedId)
    }

    let layoutNodes = singleNodeViewReady || this.state.exitingSingleNodeView === EXIT_STAGE_FADE ? compressedLayout(this.state.x * -1, this.state.y * -1, this.state.layoutNodes, this.state.sourceNodes[this.props.focusedNode._id]) : this.state.layoutNodes

    let nodes = layoutNodes.map((node: SourceNode, i: number) => {
      let radius = node._id === this.props.focusedNode._id && node._id !== BRANE_NODE_ID
        ? LARGE_NODE_RADIUS
        : SMALL_NODE_RADIUS

      let nodeAnimationConfig: NodeAnimationConfig = { ...animationNodeData[node._id], id: this.props.animationData.id }

      if (this.state.exitingSingleNodeView === EXIT_STAGE_FADE && node._id !== this.props.singleNodeView._id) {
        nodeAnimationConfig = {
          id: this.props.animationData.id - 0.5,
          delay: 0,
          type: 'hide',
        }
      }

      let nodeOnLeft = findNodeOnLeft(node, this.state.positions) || null
      // Full means the node on left is focused, half is if the
      // node is not focused, but the orbit is visible.
      // Empty is if there is no orbit on the left.
      // This is used by the node to only truncate relatives titles
      // if needed
      let leftStatus: SideStatus = 'empty'
      if (!nodeOnLeft) {
        leftStatus = 'empty'
      } else if (nodeOnLeft._id === this.props.focusedNode._id) {
        leftStatus = 'full'
      } else if (orbitVisible(nodeOnLeft)) {
        leftStatus = 'half'
      }

      let nodeOnRight = findNodeOnRight(node, this.state.positions) || null
      let rightStatus: SideStatus = 'empty'
      if (!nodeOnRight) {
        rightStatus = 'empty'
      } else if (nodeOnRight._id === this.props.focusedNode._id) {
        rightStatus = 'full'
      } else if (orbitVisible(nodeOnRight)) {
        rightStatus = 'half'
      }

      let applyFilter = ['current-children', 'all-children'].indexOf(this.props.filterWithin) > -1

      if (this.props.filterWithin === 'venn-search' && node._id === VENN_ID) {
        applyFilter = true
      }

      let x = node.x
      let y = node.y
      if (this.props.singleNodeView.show && this.props.singleNodeView.prepared && this.props.singleNodeView._id === node._id) {
        x = -1 * this.state.x + document.body.clientWidth - (236 / 2) + 25
        y = -1 * this.state.y + document.body.clientHeight / 2
      }

      if (this.props.menu && this.props.menu.parentId === node._id) {
        menuPos.x = x
        menuPos.y = y
        menuPos.index = i
      }

      const focused = node._id === this.props.focusedNode._id && !this.state.losingFocus

      let orbitStyle = {
        color: 'rgba(256, 256, 256, 0.3)',
        color2: '',
      }

      const isLoading = this.props.loadingRelativesFor === node._id

      return (
        <Node
          key={`node-${node._id}`}
          focusChild={this.props.focusChild}
          onFocusedChild={this.onFocusedChild}
          focusedChild={this.state.focusedChild}
          childDragStopped={this.childDragStopped}
          showTargetLinkNode={this.state.targetLinkNode && this.state.targetLinkNode._id === node._id}
          x={x}
          y={y}
          sidebarMenu={!!this.props.sidebarMenu}
          parent={node}
          nodeClicked={this.nodeClicked}
          showSingleNodeView={this.showSingleNodeView}
          showNodeCreationWindow={this.props.showNodeCreationWindow}
          showLinkPreview={this.showLinkPreview}
          singleNodeViewReady={this.props.singleNodeViewReady}
          hideSingleNodeView={this.props.hideSingleNodeView}
          closeMenu={this.props.hideMenu}
          exploreNode={this.exploreNode}
          addReorderedRelative={this.props.addReorderedRelative}
          toggleClusterState={this.props.toggleClusterState}
          menu={this.props.menu}
          openMenuFor={focused ? this.props.openMenuFor : null}
          radius={radius}
          filter={applyFilter ? filters : null}
          focused={focused}
          faded={(singleNodeViewReady || this.state.exitingSingleNodeView > -1) && this.props.singleNodeView._id !== node._id}
          leftStatus={leftStatus}
          rightStatus={rightStatus}
          singleNodeView={this.props.singleNodeView.show && this.props.singleNodeView._id === node._id}
          singleNodeViewPrepared={this.props.singleNodeView.prepared}
          relatives={this.state.sourceNodes[node._id].relatives}
          animationConfig={nodeAnimationConfig}
          draggingChild={this.draggingChild}
          reorderedRelatives={this.props.reorderedRelatives[node._id] || []}
          focusedNode={this.props.focusedNode}
          showOnOrbit={this.props.showOnOrbit}
          initialAppear={this.props.welcome}
          overlayOpen={this.props.overlayOpen}
          miniClusters={this.props.miniClusters}
          expandedMiniCluster={this.props.expandedMiniClusters[node._id]}
          selectMiniCluster={this.props.selectMiniCluster}
          properties={focused ? this.props.focusedNodeProperties : {}}
          activeProperties={focused ? this.props.activeProperties : []}
          color={orbitStyle.color}
          relativesLoading={isLoading}
          preLoad={this.props.preLoaded}
        />
      )
    })

    let lines: JSX.Element[] = []
    if (!this.props.singleNodeView.show && this.state.exitingSingleNodeView === -1) {
      lines = this.state.links.map(link => {
        if (!link) {
          return null
        }
        let delay = 0
        let animationType: LinkAnimationType = 'show'

        let targetAnimation = this.props.animationData.nodes[link.targetID]
        if (targetAnimation && targetAnimation.type === 'show') {
          delay = targetAnimation.delay - 200
        } else if (targetAnimation && targetAnimation.type === 'hide') {
          delay = targetAnimation.delay
          animationType = 'hide'
        }

        let nearFocused = this.props.focusedNode._id === link.sourceID || this.props.focusedNode._id === link.targetID

        return (
          <Line
            key={`link-${link.x1}-${link.y1}-${link.x2}-${link.y2}`}
            startX={link.x1}
            startY={link.y1}
            stopX={link.x2}
            stopY={link.y2}
            startID={link.sourceID}
            stopID={link.targetID}
            menuShown={this.props.menu !== null}
            delay={delay}
            animationType={animationType}
            showPreview={this.showLinkPreview}
            nearFocused={nearFocused}
            reversedAngle={link.reversed}
          />
        )
      })
    }
    let className = 'fixed-path '
    if (this.state.dragging) {
      className += 'fixed-path--dragging '
    }
    if (this.state.followingNodeAnimation &&
      (sortedAnimationNodes.length - 1 > this.state.staggeredIndex)
    ) {
      className += 'fixed-path--fast-transform'
    }
    const nodeFrom = this.props.menu !== null && this.state.sourceNodes[this.props.menu.parentId || this.props.menu.node._id]
    const menu = this.props.menu !== null && !this.state.draggingChild &&
      <g
        key='menu'
        style={{
          transform: `translate(${menuPos.x}px, ${menuPos.y}px)`,
        }}
      >
        <Menu
          overlayOpen={this.props.overlayOpen}
          onFocusedChild={this.onFocusedChild}
          hideNodePreviewWindow={this.props.hideNodePreviewWindow}
          hideLinkPreviewWindow={this.props.hideLinkPreviewWindow}
          node={this.props.menu.node}
          isChild={this.props.menu.isChild}
          isCollapsed={this.isCollapsed(this.props.menu.node._id)}
          parentNode={this.state.sourceNodes[this.props.menu.parentId]}
          isFirst={(!nodeFrom || !nodeFrom.originallyFrom)}
          x={this.props.menu.x}
          y={this.props.menu.y}
          overflow={this.menuOverflow(menuPos.y + this.props.menu.y)}
          orbitLocked={this.state.sourceNodes[this.props.menu.parentId].orbitLocked}
          exploreNode={this.exploreNode}
          focusedNodeId={this.props.focusedNode._id}
          hideMenu={this.props.hideMenu}
          showNodePreview={this.props.showNodePreview}
          showLinkPreview={this.showLinkPreview}
          toggleOrbitLock={this.props.toggleOrbitLock}
          collapseBranch={this.collapseBranch}
          expandBranch={this.expandBranch}
          showBranchPipeline={this.props.showBranchPipeline}
          addProfileNodeToLineage={this.props.addProfileNode}
          confirmRestorePath={this.props.confirmRestorePath}
        />
        {' '}
      </g>

    const menuOverlay = this.props.menu !== null && (
      <g
        key='overlay'
        style={{
          transform: `translate(${menuPos.x}px, ${menuPos.y}px)`,
        }}
      >
        <NodeMenuOverlay
          x={0}
          y={0}
          hideMenu={this.props.hideMenu}
        />
      </g>
    )

    nodes.splice(menuPos.index + 1, 0, menu)
    nodes.splice(menuPos.index, 0, menuOverlay)
    return (
      <div>
        {
          this.props.welcome && <Welcome firstName={this.props.auth ? this.props.auth.firstName : null} />
        }
        <svg
          className={className}
          style={{ backgroundImage: `url(${background})`}}
          onMouseDown={this.mouseDown}
          onMouseMove={this.mouseMove}
          onMouseUp={this.mouseUp}
        >
          <g
            className='fixed-path__main-group'
            style={{
              transform: `translate(${cords.x}px, ${cords.y}px) scale(${this.props.zoomValue})`,
            }}
          >
            {lines}
            {nodes}

          </g>
        </svg>
        {this.state.showLinkCreationDialog &&
          <LinkCreationOptionsDialog
            onSelectOption={this.handleConfirmLinkCreationDialog}
            nodes={this.state.sourceNodes}
            {...this.state.showLinkCreationDialog} />
        }
        {this.props.branchPipeline.show &&
          <BranchPipeline
            node={this.state.sourceNodes[this.props.branchPipeline.id]}
            nodes={this.state.sourceNodes}
            hideBranchPipeline={this.hideBranchPipeline}
            showPreview={this.props.showNodePreview}
            restoreBranch={this.expandBranch} />
        }
      </div>
    )
  }

  componentDidUpdate () {
    if (this.state.exitingSingleNodeView === EXIT_STAGE_REARRANGE) {
      setTimeout(() => {
        this.setState({
          exitingSingleNodeView: -1,
        })
      }, 10)
    }

    let animationDataLength = this.sortAnimationNodes().length
    if (this.state.followingNodeAnimation && animationDataLength > 0 && animationDataLength - 1 > this.state.staggeredIndex) {
      setTimeout(() => {
        this.setState({
          staggeredIndex: this.state.staggeredIndex + 1,
        })
      }, 1000)
    } else {
      if (this.state.followingNodeAnimation) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          followingNodeAnimation: false,
          staggeredIndex: -1,
        })
      }
    }
  }
  findCoords (focusedNodeId: string) {
    let layoutData = this.state.sourceNodes
    let node = layoutData[focusedNodeId]
    return {
      x: window.innerWidth / 2 - node.x,
      y: window.innerHeight / 2 - node.y,
    }
  }
  updateLayout (nodes: {[index: string]: NodeType}, nodeToRelatives: {[index: string]: RelativeMap}, focusedNode: NodeType) {
    let nodesWithRelatives: {[index: string]: SourceNode} = {} 
    Object.keys(nodes).forEach(key => {
      let node = nodes[key]

      // TODO: check if we can safely avoid mutating
      nodesWithRelatives[key] = (node as SourceNode)
      nodesWithRelatives[key].relatives = nodeToRelatives[key]
    })

    let layoutData = layout(nodesWithRelatives)

    let focusedNodePos = { x: 0, y: 0 }

    let nodeLength = layoutData.layoutNodes.length
    for (let i = 0; i < nodeLength; i++) {
      if (layoutData.layoutNodes[i]._id === focusedNode._id) {
        focusedNodePos = {
          x: layoutData.layoutNodes[i].x,
          y: layoutData.layoutNodes[i].y,
        }
        break
      }
    }

    let x = window.innerWidth / 2 - (focusedNodePos.x * this.props.zoomValue)
    let y = window.innerHeight / 2 - (focusedNodePos.y * this.props.zoomValue)

    return {
      x,
      y,
      layoutNodes: layoutData.layoutNodes,
      links: layoutData.links,
      sourceNodes: layoutData.sourceNodes,
      positions: layoutData.positions,
    }
  }
  updateTransform = () => {
    if (this.updateTransformTimeout) {
      clearTimeout(this.updateTransformTimeout)
    }
    this.updateTransformTimeout = setTimeout(
      () => {
        // TODO: only find new x and y. It doesn't need to update layout.
        let layoutData = this.updateLayout(
          this.props.nodes,
          this.props.relatives,
          this.props.focusedNode
        )
        this.setState(layoutData)
      },
      250
    )
  }
  openLPW = (openLPWfor: { from: string, to: string, forward: boolean }) => {
    const { focusedNode, relatives, showLinkPreview, singleNodeView } = this.props
    let timeoutLength = singleNodeView.show ? 2100 : 1500

    if (openLPWfor.forward) {
      timeoutLength = 100
    }
    const waitAndShowLinkPreview = () => (setTimeout(() => {
      showLinkPreview(openLPWfor.to, openLPWfor.from, true)
    }, timeoutLength))

    if (focusedNode._id === openLPWfor.from) { // If the origin node is already expanded
      const target = relatives[openLPWfor.from][openLPWfor.to]

      target && this.exploreNode(target._id, target.title, openLPWfor.from, target.angle)
      waitAndShowLinkPreview()
    } else { // If the origin node is not expanded
      const targetParent = relatives[focusedNode._id][openLPWfor.from]

      if (targetParent) {
        this.exploreNode(targetParent._id, targetParent.title, focusedNode._id, targetParent.angle)
      }

      setTimeout(() => {
        const _target = this.props.relatives[openLPWfor.from][openLPWfor.to]

        if (_target) {
          this.exploreNode(_target._id, _target.title, openLPWfor.from, _target.angle)
          waitAndShowLinkPreview()
        }
      }, timeoutLength)
    }
  }
  componentWillReceiveProps (props: Props) {
    if (this.props.singleNodeView.show && !props.singleNodeView.show) {
      this.setState({
        exitingSingleNodeView: EXIT_STAGE_FADE,
      })

      setTimeout(() => {
        this.setState({
          exitingSingleNodeView: EXIT_STAGE_REARRANGE,
        })
      }, 1000)
    }

    // Don't recreate layout when opening or closing link menu
    if (
      !(props.menu && typeof props.menu.node === 'string') &&
      !(this.props.menu && typeof this.props.menu.node === 'string') &&
      (
        this.props.nodes !== props.nodes ||
        this.props.focusedNode !== props.focusedNode ||
        this.props.relatives !== props.relatives
      )
    ) {
      let layoutData = this.updateLayout(
        props.nodes,
        props.relatives,
        props.focusedNode
      )
      this.setState(layoutData)
    }
    if (
      props.animationData.id !== this.props.animationData.id &&
      props.animationData.follow === props.animationData.id
    ) {
      this.setState({
        followingNodeAnimation: true,
        staggeredIndex: 0,
      })
    }

    // Update transform when is required
    if (props.centerOnFocused !== this.props.centerOnFocused) {
      this.updateTransform()
    }

    // explicit expand node
    if (props.openLPWfor !== this.props.openLPWfor) {
      this.openLPW(props.openLPWfor)
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.updateTransform)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.updateTransform)
  }
}

const mapDispatchToProps = {
  focusNode,
  addNode,
  addLink,
  addReorderedRelative,
  showMenu,
  hideMenu,
  toggleOrbitLock,
  collapseBranch,
  expandBranch,
  showNodePreview,
  showLinkPreview,
  showBranchPipeline,
  hideBranchPipeline,
  animateBranchCollapse,
  showSingleNodeView,
  hideSingleNodeView,
  addProfileNode,
  showNodeCreationWindow,
  singleNodeViewReady,
  hideNodePreviewWindow: hideNodePreview,
  hideLinkPreviewWindow: hideLinkPreview,
  showLinkCreationWindow,
  confirmRestorePath,
  toggleClusterState,
  selectMiniCluster,
  childrenPreLoaded,
}

const mapStateToProps = createStructuredSelector({
  focusedNode: selectFocusedNode,
  nodes: selectNodes,
  relatives: selectRelatives,
  menu: selectMenu,
  openMenuFor: selectOpenMenuFor,
  branchPipeline: selectBranchPipeline,
  animationData: selectAnimationData,
  filterWithin: selectFilterWithin(),
  tagFilters: selectTagFilters(),
  singleNodeView: selectSingleNodeView,
  reorderedRelatives: selectReorderedRelatives,
  zoomValue: selectZoomValue,
  centerOnFocused: selectCenterOnFocused,
  openLPWfor: selectOpenLPWfor,
  showOnOrbit: selectShowOnOrbit(),
  sidebarMenu: selectSidebarMenu(),
  showNodePreviewWindow: selectShowNodePreviewWindow(),
  nodeCreationWindow: selectNodeCreationWindow(),
  linkCreationWindow: selectLinkCreationWindow(),
  nodeEditWindow: selectNodeEditWindow(),
  linkEditWindow: selectLinkEditWindow(),
  auth: selectAuth,
  welcome: selectWelcome(),
  focusChild: selectFocusChild,
  miniClusters: selectMiniClusters,
  expandedMiniClusters: selectExpandedMiniClusters,
  focusedNodeProperties: selectFocusedNodeProperties(),
  activeProperties: selectActiveProperties(),
  loadingRelativesFor: selectLoadingRelativesFor(),
  preLoaded: selectPreLoaded(),
})

export default connect(mapStateToProps, mapDispatchToProps)(FixedPath)
