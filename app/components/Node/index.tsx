import { filterNodeObject, filterShowOnOrbit } from 'utils/filterNodes'
import {
  getClusterType,
  isCluster,
  isCategorizingLink,
  keyToTree,
} from 'utils/tags'
import Center from './center'
import Close from './close'
import Orbit from './orbit'
import React from 'react'
import {
  clone, pickBy,
} from 'lodash-es'
import { relativesOnOrbit } from 'utils/fixed-path'
import { BRANE_NODE_ID, VENN_ID } from '../../constants'
import { featureEnabled } from 'utils/features'
import { Relative, RelativeMap, SideStatus, ShowOnOrbit, TagPath, NodeMenuConfig, SourceNode, ReorderedRelative } from 'containers/FixedPath/types'
import { FocusedNodeProperties, FocusedNodeProperty, ActiveProperty } from 'containers/PropertySidebar/types'

const MAX_CHILD_TITLE_NEIGHBOR_FULL = 20
const MAX_CHILD_TITLE_NEIGHBOR_HALF = 20
const MAX_CHILD_TITLE_BOTH_HALF = 40
const MAX_CHILD_TITLE_EMPTY = 45
const VISIBILITY = {
  show: 'show',
  hidden: 'hidden',
  hiding: 'hiding',
}
export const MAX_CENTER_TITLE_LENGTH = 32

type Visibility = 'show' | 'hidden' | 'hiding'

export type NodeAnimationConfig = {
  id: number,
  _id?: string,
  delay?: number,
  type: 'hide' | 'show'
}

type Props = {
  x: number,
  y: number,
  radius: number,
  onMouseOverNode: (e: MouseEvent, targetLinkNode: Relative) => void,
  relatives: RelativeMap,
  reorderedRelatives: ReorderedRelative[],
  animationConfig: NodeAnimationConfig
  parent: SourceNode,
  // TODO: we can remove the {} type, NodeMenuConfig coercions, and other code for
  // link menus since we no longer use them
  menu: NodeMenuConfig,
  openMenuFor: string,
  focused: boolean,
  leftStatus: SideStatus,
  rightStatus: SideStatus,
  nodeClicked: Function,
  closeMenu: () => void,
  faded: boolean,
  showOnOrbit: ShowOnOrbit,
  showTitle: boolean,
  initialAppear: boolean,
  overlayOpen: boolean,
  toggleClusterState: Function,
  showTargetLinkNode: boolean,
  childDragStopped: Function,
  dragLinkMode: boolean,
  showNodeCreationWindow: Function,
  showLinkPreview: (startId: string, stopId: string) => void,
  focusChild: string,
  onFocusedChild: (relative: any) => void,
  focusedChild: SourceNode,
  exploreNode: Function,
  addReorderedRelative: Function,
  singleNodeViewReady: () => void,
  hideSingleNodeView: (() => void),
  filter: {
    within: string,
    tagFilters: TagPath[]
  },
  draggingChild: Function,
  singleNodeView: boolean,
  singleNodeViewPrepared: boolean,
  showSingleNodeView: (_id: string) => void,
  selectMiniCluster: Function,
  miniClusters: boolean,
  expandedMiniCluster: string,
  properties: FocusedNodeProperties,
  activeProperties: ActiveProperty[],
  relativesLoading: boolean,
  preLoad: boolean,
  color: string,
}

type State = {
  visibility: Visibility,
}

type GroupedByCluster = {
  [index: string]: Relative[]
}

export default class Node extends React.Component<Props, State> {
  animationHandled = -1
  rerenderTimeout: number = null

  // TODO: properly type these
  static defaultProps: any = {
    parent: { vennIds: [] },
    relatives: [],
    menu: null,
    animationConfig: {},
    activeProperties: [],
  }

  state = {
    visibility: ('show' as Visibility),
  }
  componentWillMount = () => {
    this.handleAnimations(this.props.animationConfig)
  }
  childClicked = (node: Relative, x: number, y: number, isChild: boolean) => {
    if (node.miniCluster) {
      return this.props.selectMiniCluster(
        this.props.parent._id,
        this.props.expandedMiniCluster ? null : node._id
      )
    }

    this.props.nodeClicked(node, x, y, isChild, this.props.parent._id)
  }

  filterForClusterState = (relatives: RelativeMap) => {
    return Object.keys(relatives).reduce((result: RelativeMap, childKey) => {
      const child = relatives[childKey]
      const isCategorizing = isCategorizingLink({ _type: child.linkType })

      if (child.miniCluster) {
        // We always want to show mini clusters since otherwise it
        // can be confusing on why they are not shown
        result[childKey] = child
      } else if (isCategorizing && !this.props.parent.invertCluster) {
        result[childKey] = child
      } else if (!isCategorizing && this.props.parent.invertCluster) {
        result[childKey] = child
      }

      return result
    }, {})
  }

  nodeClicked = (node: Relative, x: number, y: number, isChild: boolean, parentId: string, angle: number, enterEvent: boolean) => {
    this.props.nodeClicked(node, x, y, isChild, this.props.parent._id, angle, enterEvent)
  }

  getMaxTitleLength = (sideStatus: SideStatus) => {
    switch (sideStatus) {
      case 'empty':
        return MAX_CHILD_TITLE_EMPTY
      case 'half':
        return this.props.focused ? MAX_CHILD_TITLE_NEIGHBOR_HALF : MAX_CHILD_TITLE_BOTH_HALF
      case 'full':
        return MAX_CHILD_TITLE_NEIGHBOR_FULL
    }
  }
  groupRelativesByClusters = (relativesArray: Relative[]) => {
    return relativesArray.reduce((result: GroupedByCluster, child) => {
      if (!child.tagList || child.tagList.length === 0) {
        result.other = result.other || []
        result.other.push(child)

        return result
      }

      child.tagList.forEach(tagFilter => {
        const key = tagFilter[tagFilter.length - 1]._key

        if (!(key in result)) {
          result[key] = []
        }

        result[key].push(child)
      })

      return result
    }, {})
  }
  childrenOfExpandedCluster = (relativeNodes: RelativeMap, expandedMiniCluster: string) => {
    return Object.values(relativeNodes).filter(child => {
      if (!child.tagList || child.tagList.length === 0) {
        return expandedMiniCluster === 'other'
      }

      return child.tagList.find(tagFilter => tagFilter[tagFilter.length - 1]._key === expandedMiniCluster)
    }).reduce((result: RelativeMap, child) => {
      result[child._id] = child
      return result
    }, {})
  }
  createMiniClusters = (relativeNodes: RelativeMap) => {
    const groupedRelatives = this.groupRelativesByClusters(Object.values(relativeNodes))

    return Object.entries(groupedRelatives).reduce((result: RelativeMap, [ clusterKey, relatives ]) => {
      if (relatives.length > 1) {
        result[clusterKey] = this.createMiniCluster(clusterKey, relatives.length, false)
      } else {
        result[clusterKey] = this.createMiniCluster(clusterKey, relatives.length, false)
        let tagTree = keyToTree(clusterKey)

        if (tagTree) {
          relatives = relatives.map(child => ({
            ...child,
            title: `(${tagTree.title}) ${child.title}`
          }))
        }

        relatives.forEach(child => {
          result[child._id] = child
        })
      }
      return result
    }, {})
  }
  addExpandedMiniCluster = (
    { visibleRelatives, sortedNodes, expanded, collapsible = true }:
      {visibleRelatives: Relative[], sortedNodes: RelativeMap, expanded: string, collapsible?: boolean}
    ) => {
    let count = 0
    if (visibleRelatives.length) {
      count = this.groupRelativesByClusters(
        Object.values(sortedNodes)
      )[expanded].length
    }

    return visibleRelatives.unshift(
      this.createMiniCluster(expanded, count, true, collapsible)
    )
  }
  createMiniCluster = (key: string, count: number, selected: boolean, collapsible: boolean = true): Relative => {
    return {
      parentCount: count,
      title: key === 'other' ? 'Other' : keyToTree(key).title,
      _id: key,
      _type: getClusterType(),
      miniCluster: {
        selected,
        collapsible,
      },
      linkType: 'relative',
      linkDirection: 'parent',
      linkName: '',
      collapsed: false,
      childCount: 0,
      tagList: []
    }
  }

  addChildToOrbit = (visibleNodes: Relative[], childId: string) => {
    let found = visibleNodes.find(node => {
      return node._id === childId
    })

    if (!found) {
      visibleNodes.splice(0, 1, clone(this.props.relatives[childId]))
    }

    return visibleNodes
  }
  filterPreOrbit = (vennSearch: boolean) => {
    const {
      filter,
      focused,
    } = this.props

    if (!filter) {
      return false
    }

    return filter.within === 'all-children' ||
      (filter.within === 'current-children' && focused) ||
      (filter.within === 'venn-search' && vennSearch)
  }

  filterProperties = (children: RelativeMap) => {
    const {
      activeProperties = [],
      properties,
    } = this.props

    if (activeProperties.length === 0) {
      return children
    }

    return pickBy(children, (child) => {
      const nodeProperties = properties[child._id].properties

      if (nodeProperties.length === 0) {
        return false
      }
      return activeProperties.every((activeProperty: ActiveProperty) => {
        if (activeProperty.selectedValues.length === 0) {
          return true
        }

        return nodeProperties.find((property: FocusedNodeProperty) => {
          if (activeProperty._id === property._id) {
            return activeProperty.selectedValues.includes(property.value)
          }

          return false
        })
      })
    })
  }

  calculateRadius = (vennSearchNode?: boolean) => {
    const {
      radius,
      focused,
      singleNodeView,
      singleNodeViewPrepared,
    } = this.props
    let orbitRadius = radius + 56
    let centerRadius = radius

    if (singleNodeView && singleNodeViewPrepared) {
      orbitRadius = document.body.clientHeight * 1.058 / 2 + 20
      centerRadius = 118
    } else if (!focused && vennSearchNode) {
      centerRadius -= 5
    }

    return {
      orbitRadius,
      centerRadius,
    }
  }

  handleAnimations = ({ type, delay, id }: NodeAnimationConfig) => {
    if (id <= this.animationHandled) {
      return
    }

    if (!type || (type === 'show' && !delay)) {
      this.setState({
        visibility: 'show',
      })
    } else if (type === 'show') {
      this.startDelayedAnimation(
        'hidden',
        'show',
        delay
      )
    } else if (type === 'hide') {
      this.startDelayedAnimation(
        'show',
        'hiding',
        delay
      )
    }

    this.animationHandled = id
  }
  startDelayedAnimation = (from: Visibility, to: Visibility, delay: number) => {
    this.setState({
      visibility: from,
    })

    this.rerenderTimeout = setTimeout(() => {
      this.rerenderTimeout = null
      this.setState({
        visibility: to,
      })
    }, delay)
  }

  render = () => {
    let hiding = this.state.visibility === VISIBILITY.hiding
    const vennSearchNode = this.props.parent._id === VENN_ID
    const isRoot = this.props.parent._id === BRANE_NODE_ID

    if (this.state.visibility === VISIBILITY.hidden) {
      return null
    }

    let className = 'node '
    let childMenuOpen = false
    if (
      this.props.menu !== null &&
        this.props.menu.parentId === this.props.parent._id
    ) {
      if (!this.props.menu.isChild) {
        // the menu is opened for this node
        className += 'node--highlight-center '
      } else {
        childMenuOpen = true
      }
    }

    let childrenIds = Object.keys(this.props.relatives)

    let noChildren = childrenIds.length === 0 || typeof this.props.relatives[childrenIds[0]].title === 'undefined'
    let childrenNodes = clone(filterShowOnOrbit(this.props.relatives, this.props.showOnOrbit) || {})
    let filterForClusterState = featureEnabled('clusterState') && isCluster(this.props.parent)
    const miniClusters = this.props.miniClusters ? this.createMiniClusters(childrenNodes) : null;
    let expandedMiniCluster = this.props.expandedMiniCluster
    const singleMiniCluster = miniClusters && Object.keys(miniClusters).length === 1

    if (!expandedMiniCluster && singleMiniCluster) {
      expandedMiniCluster = Object.keys(miniClusters)[0]
    }

    if (
      expandedMiniCluster
    ) {
      childrenNodes = this.childrenOfExpandedCluster(childrenNodes, expandedMiniCluster)
    } else if (this.props.miniClusters) {
      // We want to always show the mini clusters
      filterForClusterState = false

      childrenNodes = miniClusters
    }

    if (this.filterPreOrbit(vennSearchNode)) {
      childrenNodes = filterNodeObject(
        childrenNodes,
        this.props.filter.tagFilters  
      )
    }

    if (filterForClusterState) {
      childrenNodes = this.filterForClusterState(childrenNodes)
    }
    childrenNodes = this.filterProperties(childrenNodes)

    let {
      visibleChildren,
      hasGatewayChildren,
    } = relativesOnOrbit(
      childrenNodes,
      {
        parentFrom: this.props.parent.from,
        reorderedRelatives: this.props.reorderedRelatives,
        noLimit: this.props.singleNodeView && this.props.singleNodeViewPrepared,
        properties: this.props.properties,
        activeProperties: this.props.activeProperties,
        orbitLocked: this.props.parent.orbitLocked && !this.props.focused,
      }
    )

    if (expandedMiniCluster) {
      this.addExpandedMiniCluster({
        visibleRelatives: visibleChildren,
        sortedNodes: childrenNodes,
        expanded: expandedMiniCluster,
        collapsible: !singleMiniCluster
      })
    }

    // If the node menu is open, make sure the child it is open for is shown
    if (
      this.props.openMenuFor ||
      childMenuOpen
    ) {
      const nodeId = this.props.openMenuFor || (this.props.menu as NodeMenuConfig).node._id

      this.addChildToOrbit(visibleChildren, nodeId)
    }

    if (this.props.menu !== null) {
      className += 'node--menu-visible '
    }
    if (this.props.faded) {
      className += 'node--faded '
    }
    if (!this.props.faded && (hasGatewayChildren || this.props.parent.orbitLocked)) {
      className += 'node--has-gateway '
    }

    if (hiding) {
      className += 'node--hiding '
    }

    // TODO: this.props.parent will need imageUrl's from the backend
    // TODO: remove user node code for now
    if (this.props.parent.imageUrl || this.props.parent.isUserNode) {
      // When clicking on nodes with images, we don't want extra classes.
      className = 'node '

      // fade image when node menu is visible
      if (
        this.props.menu !== null &&
        // this.props.faded is always false, workaround
        (this.props.menu as NodeMenuConfig).parentId !== this.props.parent._id
      ) {
        className += 'node--faded'
      }
    }

    let leftMaxTitleLength = this.getMaxTitleLength(this.props.leftStatus)
    let rightMaxTitleLength = this.getMaxTitleLength(this.props.rightStatus)

    const {
      orbitRadius,
      centerRadius,
    } = this.calculateRadius()

    const addEnabled = featureEnabled('addLinkOrNode')
    let showAddButton = addEnabled && this.props.focused && !this.props.singleNodeView && !isRoot

    let nodeCount

    if (noChildren) {
      nodeCount = visibleChildren.length
    } else {
      nodeCount = Object.keys(childrenNodes).length - 1
    }

    return (
      <g
        className={className}
        transform={`translate(${this.props.x},${this.props.y})`}
      >
        <Center
          onMouseOverNode={(this.props.onMouseOverNode as any)}
          focused={this.props.focused}
          overlayOpen={this.props.overlayOpen}
          isUserNode={this.props.parent.isUserNode}
          menuOpen={this.props.menu}
          radius={centerRadius}
          parent={this.props.parent}
          text={this.props.parent.title}
          showTitle={this.props.showTitle}
          parentClicked={this.nodeClicked}
          nodeCount={nodeCount}
          singleNodeView={this.props.singleNodeView && this.props.singleNodeViewPrepared}
          initialAppear={this.props.initialAppear}

          // TODO: remove animationDelay since it isn't used
          animationDelay={0}
        />
        <Orbit
          visible={this.props.relativesLoading || this.props.showTargetLinkNode ? true : hiding ? false : showAddButton || (this.props.focused && visibleChildren.length > 0)}
          orbitLocked={this.props.parent.orbitLocked}
          menuOpen={this.props.menu as NodeMenuConfig}
          childDragStopped={this.props.childDragStopped}
          showTargetLinkNode={this.props.showTargetLinkNode}
          dragLinkMode={this.props.dragLinkMode}
          showAddButton={showAddButton && !vennSearchNode}
          showNodeCreationWindow={this.props.showNodeCreationWindow}
          showMenu={this.props.menu ? this.props.closeMenu : this.childClicked}
          showLinkPreview={this.props.showLinkPreview}
          focusChild={this.props.focusChild}
          onFocusedChild={this.props.onFocusedChild}
          // The focusedChild types are a mess, but we will be removing this code soon
          focusedChild={this.props.focusedChild as any}
          nodes={visibleChildren}
          radius={orbitRadius}
          centerRadius={centerRadius}
          openExpandPositions={this.props.parent.openPositions}
          menuOpenForChild={childMenuOpen ? (this.props.menu as NodeMenuConfig).node._id : ''}
          openMenuFor={this.props.openMenuFor}
          showSingleNodeView={this.props.menu ? this.props.closeMenu : this.props.showSingleNodeView}
          toggleClusterState={this.props.toggleClusterState}
          leftMaxTitleLength={leftMaxTitleLength}
          rightMaxTitleLength={rightMaxTitleLength}
          parentTitle={this.props.parent.title}
          parentId={this.props.parent._id}
          parentCluster={isCluster(this.props.parent)}
          singleNodeView={this.props.singleNodeView}
          singleNodeViewPrepared={this.props.singleNodeViewPrepared}
          draggingChild={this.props.draggingChild}
          exploreNode={this.props.exploreNode}
          addReorderedRelative={this.props.addReorderedRelative}
          initialAppear={this.props.initialAppear}
          overlayOpen={this.props.overlayOpen}
          properties={this.props.properties}
          activeProperties={this.props.activeProperties}
          color={this.props.color}
          relativesLoading={this.props.relativesLoading}
          focusedNode={this.props.focused}
          preLoad={this.props.preLoad}
        />
        { this.props.singleNodeView && this.props.singleNodeViewPrepared && <Close onClose={this.props.hideSingleNodeView} x={80} y={-1 * document.body.clientHeight / 2 + 60} /> }
      </g>
    )
  }
  componentWillReceiveProps (newProps: Props) {
    if (newProps.singleNodeView && !newProps.singleNodeViewPrepared) {
      setTimeout(() => {
        this.props.singleNodeViewReady()
      }, 500)
    }
    this.handleAnimations(newProps.animationConfig)
  }

  shouldComponentUpdate (nextProps: Props, nextState: State) {
    return this.props !== nextProps || this.state !== nextState
  }
}
