import React from 'react'
import VennDiagram from './venn-diagram'
import withDragHandlers from 'containers/Drag'
import { ClusterIcon } from './icons'
import ClusterToggle from './ClusterToggle'
import { THEME_DEFAULT, C01_LIGHT, C01_BLACK } from 'styles/colors'
import ChildText from './ChildText'
import { VENN_ID } from '../../constants'
import { Relative } from 'containers/FixedPath/types'
import { FocusedNodeProperty } from 'containers/PropertySidebar/types'

type Props = {
  showMenu: (node: Relative, x: number, y: number, isChild: boolean) => void,
  parentTitle: string,
  x: number,
  y: number,
  node: Relative,

  // TODO: should be an enum
  side: string
  menuOpenFor: boolean,
  openMenu: boolean,
  maxTitleLength: number,
  faded: boolean,
  isCluster: boolean,
  dragging: boolean,
  singleNodeView: boolean,
  mouseDown: ((event: React.MouseEvent) => void),
  properties: FocusedNodeProperty[]
}

export class Child extends React.Component<Props> {
  showMenu = () => {
    this.props.showMenu(this.props.node, this.props.x, this.props.y, true)
  }

  render () {
    let branchLength = (this.props.node as any).branchLength

    if (this.props.node._id === VENN_ID) {
      branchLength = 0
    }

    let radius = 9
    if (branchLength) {
      radius = 12
    } else if (this.props.node.gateway) {
      radius = 7
    }

    let className = 'node__related-node '
    if (this.props.faded) {
      className += 'node__related-node--faded '
    }

    if (this.props.menuOpenFor) {
      className += 'node__related-node--menu-open '
    }

    let dot = this.props.node._id === VENN_ID
      // TODO: check if a venn diagram could ever be a relative.
      ? <VennDiagram scale={0.10} />
      : this.props.node.miniCluster
        // TODO: selectedCluster should not be a property of the node
        ? <ClusterToggle radius={radius} expanded={this.props.node.miniCluster.selected} />
        : this.props.isCluster
          ? <ClusterIcon fill={this.props.node.focused ? C01_BLACK : branchLength > 0 ? THEME_DEFAULT : C01_LIGHT} r={radius} />
          : <circle cx={0} cy={0} fill={this.props.node.focused ? C01_BLACK : branchLength > 0 ? THEME_DEFAULT : C01_LIGHT} r={radius} />
    return (
      <g
        style={{
          transform: `translate( ${this.props.x}px, ${this.props.y}px)`,
          transition: !this.props.dragging && !this.props.singleNodeView ? '0.4s transform' : 'none',
        }}
        className={className}
        onClick={this.showMenu} onMouseDown={this.props.mouseDown}>
        {dot}
        {branchLength ? <text className='node__related-node__branch-length' x={this.props.side === 'top' ? -2 : 0} y={4}>{branchLength}</text> : null}
        {this.props.node.gateway && !branchLength && this.props.node._id !== VENN_ID ? <circle cx={0} cy={0} stroke='rgb(256, 256, 256)' fill='transparent' r='12' /> : null}
        <ChildText
          side={this.props.side}
          node={this.props.node}
          parentTitle={this.props.parentTitle}
          maxTitleLength={this.props.maxTitleLength}
          properties={this.props.properties}
        />
      </g>
    )
  }
  shouldComponentUpdate (newProps: Props) {
    return newProps !== this.props
  }
  componentDidMount () {
    this.componentDidUpdate()
  }
  componentDidUpdate () {
    if (this.props.openMenu) {
      this.showMenu()
    }
  }
}

export default withDragHandlers(Child)
