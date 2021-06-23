import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from '../../components/Dialog'
import LineageToolUI from 'components/LineageTool'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { focusNode, restorePath } from 'containers/FixedPath/actions'
import selectLineageTool from './selectors'
import { confirmRestorePath, cancelRestorePath, focusPathWindow } from './actions'
import { selectSingleNodeView, selectNodes, selectFocusedNode, selectMenu } from 'containers/FixedPath/selectors'
import { ENTER, ESCAPE, ARROW_UP, ARROW_DOWN } from '../../utils/key-codes'
import { hide } from '../NodePreviewWindow/actions'
import { hidePreview } from '../LinkPreviewWindow/actions'
import { findInPaths } from 'utils/fixed-path'
import { featureEnabled } from '../../utils/features'

export class LineageTool extends Component {
  static propTypes = {
    cancelRestorePath: PropTypes.func,
    confirmRestorePath: PropTypes.func,
    focusNode: PropTypes.func,
    focusedNode: PropTypes.object,
    hideLinkPreview: PropTypes.func,
    hidePreviewWindow: PropTypes.func,
    isNodeMenuOpen: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    overlayOpen: PropTypes.bool,
    lineage: PropTypes.object,
    nodeMenuOpen: PropTypes.object,
    nodes: PropTypes.object,
    restorePath: PropTypes.func,
    focusPathWindow: PropTypes.func,
    singleNodeView: PropTypes.object,
  }
  // Nodes are removed when changing the active path, so we need to cache
  // data about them for when their path is no longer active
  cachedNodes = {}

  state = {
    isPathWindowMinimized: false,
    isPathWindowExpanded: true,
  }

  toggleMinimize = () => {
    if (!this.state.isPathWindowMinimized && this.state.isPathWindowExpanded) {
      this.toggleExpanded()
    }
    this.setState({
      isPathWindowMinimized: !this.state.isPathWindowMinimized,
    })
  }

  toggleExpanded = () => {
    this.setState({
      isPathWindowExpanded: !this.state.isPathWindowExpanded,
    })
  }

  addClustersDetails (path) {
    const nodes = this.props.nodes
    const history = path.history.map(historyItem => {
      if (!(historyItem.id in this.cachedNodes) && nodes[historyItem.id]) {
        this.cachedNodes[historyItem.id] = {
          isCluster: nodes[historyItem.id].isCluster,
        }
      }

      const node = this.cachedNodes[historyItem.id] || { isCluster: false }

      return {
        ...historyItem,
        type: historyItem.type === 'simple' && node.isCluster ? 'cluster' : historyItem.type,
      }
    })

    return {
      ...path,
      history,
    }
  }
  handleHistoryItemClick = (pathIndex, nodeId) => {
    const {
      focusNode,
      focusedNode,
      isNodeMenuOpen,
      lineage,
      confirmRestorePath,
      hidePreviewWindow,
      hideLinkPreview,
    } = this.props
    if (pathIndex !== lineage.activePathIndex) {
      return confirmRestorePath(pathIndex, nodeId)
    } else if (focusedNode._id !== nodeId) {
      isNodeMenuOpen && this.createKeyEvent(ESCAPE)
      focusNode(nodeId)
    }
    if (isNodeMenuOpen) {
      this.createKeyEvent(ESCAPE)
    } else if (focusedNode._id === nodeId) {
      this.createKeyEvent(ENTER)
    }
    hidePreviewWindow()
    hideLinkPreview()
  }
  createKeyEvent = keyCode => {
    const keyEvent = new window.KeyboardEvent('keydown', { keyCode })
    document.dispatchEvent(keyEvent)
  }
  handleConfirmResult = (buttonClicked) => {
    const restoreDetails = this.props.lineage.confirmRestorePath
    const paths = this.props.lineage.paths

    switch (buttonClicked) {
      case 'Cancel':
        this.props.cancelRestorePath()
        break
      case 'Open':
        this.props.restorePath(paths[restoreDetails.pathIndex].id)
        this.props.focusNode(restoreDetails.nodeId)
        break

      // no default
    }
  }

  moveNodeFocus = (forward = false) => {
    const { lineage: { paths }, focusedNode } = this.props
    const { history = [], historyIndex = -1, pathIndex = -1 } = findInPaths(paths, focusedNode._id)
    if (forward) {
      if (historyIndex >= 0 && historyIndex < history.length - 1) {
        this.handleHistoryItemClick(pathIndex, history[historyIndex + 1].id)
      } else if (historyIndex === history.length - 1 && pathIndex < paths.length - 1) {
        const { history: nextHistory } = paths[pathIndex + 1]
        this.handleHistoryItemClick(pathIndex + 1, nextHistory[0].id)
      }
    } else {
      if (historyIndex > 0) {
        this.handleHistoryItemClick(pathIndex, history[historyIndex - 1].id)
      } else if (historyIndex === 0 && pathIndex > 0) {
        const { history: prevHistory } = paths[pathIndex - 1]
        this.handleHistoryItemClick(pathIndex - 1, prevHistory[prevHistory.length - 1].id)
      }
    }
  }

  pathWindowKeyHandler = (event) => {
    if (!featureEnabled('lineageKeyboardShortcuts')) {
      return
    }

    if (this.props.lineage.pathWindowFocused && !this.props.overlayOpen) {
      switch (event.keyCode) {
        case ARROW_UP:
          return this.moveNodeFocus()
        case ARROW_DOWN:
          return this.moveNodeFocus(true)
      // no default
      }
    }
  }

  componentWillMount () {
    document.addEventListener('keydown', this.pathWindowKeyHandler)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.pathWindowKeyHandler)
  }

  render () {
    const { lineage, singleNodeView, focusPathWindow } = this.props

    const paths = lineage.paths.map((path, index) => this.addClustersDetails(path, index))

    return (
      <div>
        {!singleNodeView.show &&
        !lineage.confirmRestorePath &&
          <LineageToolUI
            focusPathWindow={focusPathWindow}
            isPathWindowMinimized={this.state.isPathWindowMinimized}
            isPathWindowExpanded={this.state.isPathWindowExpanded}
            toggleMinimize={this.toggleMinimize}
            toggleExpanded={this.toggleExpanded}
            nodeMenuOpen={this.props.nodeMenuOpen}
            paths={paths}
            handleHistoryItemClick={this.handleHistoryItemClick}
          />}
        {lineage.confirmRestorePath &&
          <Dialog
            text='Do you want to open your previous path?'
            onClick={this.handleConfirmResult}
            buttons={['Cancel', 'Open']}
          />}
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  lineage: selectLineageTool(),
  nodes: selectNodes,
  singleNodeView: selectSingleNodeView,
  focusedNode: selectFocusedNode,
  isNodeMenuOpen: selectMenu,
})

function mapDispatchToProps (dispatch) {
  return {
    dispatch,
    focusNode (id) {
      dispatch(focusNode(id))
    },
    restorePath (id) {
      dispatch(restorePath(id))
    },
    confirmRestorePath (pathId, nodeId) {
      dispatch(confirmRestorePath(pathId, nodeId))
    },
    cancelRestorePath () {
      dispatch(cancelRestorePath())
    },
    hidePreviewWindow () {
      dispatch(hide())
    },
    hideLinkPreview () {
      dispatch(hidePreview())
    },
    focusPathWindow (value) {
      dispatch(focusPathWindow(value))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineageTool)
