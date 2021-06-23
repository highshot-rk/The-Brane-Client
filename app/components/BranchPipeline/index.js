
import {
  Body,
  Node,
  NodeSeparator,
  RestoreAll,
  RestoreLabel,
  Search,
  Separator,
  Wrapper,
  OffBranch,
  Back,
} from './elements'
import { expandedRelatives, nodesDirectlyBetween, walkBranch } from '../../utils/fixed-path'

import Overlay from 'components/Overlay'
import PropTypes from 'prop-types'
import React from 'react'
import readIcon from './read.png'
import leftArrow from './left-arrow.js'

export default class BranchPipeline extends React.Component {
  state = {
    branchOutPath: [],
    listOffBranches: '',
    search: '',
    selected: null,
  }
  close = () => {
    this.props.hideBranchPipeline()
  }
  restoreBranch = () => {
    // Resets the branchOutPath
    // so we get the correct list from getVisibleBranchChildren
    // Since this instance of the component will not be rerendered again, this is safe.
    this.state.branchOutPath = []

    let { mainBranchNodes } = this.getVisibleBranchChildren().branchChildren
    let lastId = mainBranchNodes[mainBranchNodes.length - 1]._id

    this.focusNode(lastId, false)
  }
  focusNode = (id, collapseSideBranches = true) => {
    let animationData = []
    let expandedNodeIds = []
    let maxAnimationDelay = -1

    // creates array with the id of each node in the branch.
    // This is used to add a delay to the nodes not directly between the first node
    // and the node to focus
    walkBranch({
      startId: this.props.node._id,
      nodes: this.props.nodes,
    }, (branchNodeId) => {
      expandedNodeIds.push(branchNodeId)
    })

    let nodesToCollapse = []
    if (collapseSideBranches) {
      nodesToCollapse = this.props.nodes[id].outgoing.map(node => {
        expandedNodeIds.splice(expandedNodeIds.indexOf(node._id), 1)
        return node._id
      })
    }

    let nodesToExpand = []
    if (id === this.props.node._id) {
      nodesToExpand = [id]
    } else {
      nodesToExpand = nodesDirectlyBetween(
        this.props.node,
        this.props.nodes[id],
        this.props.nodes
      )
      nodesToExpand.forEach((id, i) => {
        expandedNodeIds.splice(expandedNodeIds.indexOf(id), 1)
        let animationDelay = Math.min((nodesToExpand.length - i) * 875 - 469, 7000)
        maxAnimationDelay = animationDelay > maxAnimationDelay ? animationDelay : maxAnimationDelay
        animationData.push({
          _id: id,
          title: this.props.nodes[id].title,
          type: 'show',
          delay: animationDelay,
        })
      })
    }

    if (collapseSideBranches && id !== this.props.node._id) {
      nodesToCollapse.push(
        ...expandedNodeIds
      )
    } else {
      expandedNodeIds.forEach((id) => {
        animationData.push({
          _id: id,
          delay: maxAnimationDelay,
          type: 'show',
        })
      })
    }

    this.props.hideBranchPipeline(
      this.props.node._id,
      id,
      nodesToCollapse,
      nodesToExpand,
      animationData
    )
  }
  viewBranchOut (id) {
    this.state.branchOutPath.push(id)
    this.setState({
      branchOutPath: this.state.branchOutPath,
    })
  }
  listOffBranches (id) {
    if (this.state.listOffBranches === id) {
      id = ''
    }
    this.setState({
      listOffBranches: id,
    })
  }
  removeBranchOutPaths (length) {
    this.setState({
      branchOutPath: this.state.branchOutPath.slice(0, this.state.branchOutPath.length - length),
    })
  }
  searchChanged = (e) => {
    let selected = this.state.selected
    if (e.target.value.trim().length === 0) {
      selected = 0
    }
    this.setState({
      search: e.target.value,
      selected,
    })
  }
  inputKeyDown = (e) => {
    if (e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13) {
      return
    }
    let { branchChildren } = this.getVisibleBranchChildren()
    let currentIndex = branchChildren.mainBranchNodes.reduce((result, child, i) => child.title === this.state.selected ? i : result, 0)

    switch (e.keyCode) {
      case 40:
        // down arrow

        if (currentIndex + 1 === branchChildren.mainBranchNodes.length) {
          currentIndex = -1
        }
        this.setState({
          selected: branchChildren.mainBranchNodes[currentIndex + 1].title,
        })
        e.preventDefault()
        break
      case 38:
        // up arrow
        if (currentIndex === 0) {
          currentIndex = branchChildren.mainBranchNodes.length
        }
        console.log(currentIndex, branchChildren.mainBranchNodes)
        this.setState({
          selected: branchChildren.mainBranchNodes[currentIndex - 1].title,
        })
        e.preventDefault()
        break
      case 13:
        // enter
        this.focusNode(branchChildren.mainBranchNodes[currentIndex]._id)
        break
      // no default
    }
  }
  getVisibleBranchChildren () {
    let lastBranchOut = this.state.branchOutPath[this.state.branchOutPath.length - 1]
    let startNode = this.state.branchOutPath.length > 0
      ? this.props.nodes[lastBranchOut]
      : this.props.node
    let branchChildren = expandedRelatives(startNode, this.props.nodes)
    branchChildren.mainBranchNodes.unshift({
      _id: startNode._id,
      title: startNode.title,
      branchOffs: branchChildren.branchOffs,
    })

    let selectedFound = false
    if (this.state.search.length > 0 && this.state.selected !== null) {
      branchChildren.mainBranchNodes = branchChildren.mainBranchNodes.filter((node) => {
        if (node.title === this.state.selected) {
          selectedFound = true
        }
        if (node.title.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1) {
          return true
        }
        return false
      })
    }
    return {
      branchChildren,
      selectedExists: selectedFound,
    }
  }
  render () {
    let { branchChildren, selectedExists } = this.getVisibleBranchChildren()

    branchChildren = branchChildren.mainBranchNodes.map((node, i) => {
      let shouldShowSeperator = true
      if (i === 0 ||
        this.state.search.length > 0 ||
        branchChildren.mainBranchNodes[i - 1]._id === this.state.listOffBranches) {
        shouldShowSeperator = false
      }
      return (
        <div key={node._id}>
          {shouldShowSeperator ? <NodeSeparator level={this.state.branchOutPath.length > 0 ? 1 : 0} /> : null}
          <Node
            selected={this.state.search.length > 0 && ((i === 0 && !selectedExists) || node.title === this.state.selected)}
            onClick={this.focusNode.bind(this, node._id)}
            condensed={this.state.search.length > 0}
            level={this.state.branchOutPath.length > 0 ? 1 : 0}
            hasBranchOffs={node.branchOffs.length}
            offBranchesVisible={node._id === this.state.listOffBranches} >
            <div className='circle' />
            <span className='title'>
              {node.title}
            </span>
            <img src={readIcon} onClick={e => { e.stopPropagation(); this.props.showPreview(node._id) }} className='read' alt='Open content window' />
            {node.branchOffs.length > 0
              ? <div
                onClick={e => {
                  e.stopPropagation()
                  this.listOffBranches(node._id)
                }}
                className='offBranches'
              >
                <div className='offBranchesCircle'>
                  {node.branchOffs.length}
                </div>
                <span> Branches</span>
              </div>
              : null}
          </Node>
          {this.state.listOffBranches === node._id
            ? node.branchOffs.map(branch => {
              return (
                <OffBranch
                  key={branch._id}
                  onClick={this.viewBranchOut.bind(this, branch._id)}
                >
                  <div className='circle' />
                  {branch.title}
                </OffBranch>
              )
            })
            : null}
        </div>
      )
    })
    let parentNode = this.state.branchOutPath[this.state.branchOutPath.length - 1]

    if (parentNode) {
      let nodeObj = this.props.nodes[this.props.nodes[parentNode].originallyFrom]
      branchChildren.unshift((
        <div>
          <Node
            level={0}
            onClick={() => { this.focusNode(nodeObj._id) }}
            bold
          >
            <div className='circle' />
            <span className='title'>
              {nodeObj.title}
            </span>
            <img src={readIcon} className='read' onClick={e => { e.stopPropagation(); this.props.showPreview() }} />
          </Node>
          <NodeSeparator level='0' angled />
        </div>
      ))
    }

    return (
      <div>
        <Overlay onClose={this.close} />
        <Wrapper>
          <RestoreAll
            onClick={this.restoreBranch}
          >
            Restore Branch
          </RestoreAll>
          <Separator>
            or
          </Separator>
          <RestoreLabel>
            Restore until
          </RestoreLabel>
          <Search>
            <input value={this.state.search} onKeyDown={this.inputKeyDown} onChange={this.searchChanged} type='search' placeholder='Search' />
          </Search>
          <Body>
            {this.state.branchOutPath.length > 0
              ? <Back onClick={() => { this.removeBranchOutPaths(1) }}>{leftArrow} <span>Back</span></Back>
              : null}
            {branchChildren}
          </Body>
        </Wrapper>
      </div>
    )
  }
}

BranchPipeline.propTypes = {
  node: PropTypes.object,
  nodes: PropTypes.object,
  hideBranchPipeline: PropTypes.func,
  showPreview: PropTypes.func,
}
