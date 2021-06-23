import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  hide,
  show,
} from '../NodePreviewWindow/actions'
import { hidePreview, showPreview } from './actions'
import { selectLinkPreviewWindow } from './selectors'
import { selectNodePreviewWindow } from '../NodePreviewWindow/selectors'
import { selectNodes } from 'containers/FixedPath/selectors'
import { selectPreviewWindowHistory, selectPreviewWindowHistoryIndex } from '../HomePage/selectors'
import { focusNode, openLinkPreviewWindowFor } from '../FixedPath/actions'
import { createStructuredSelector } from 'reselect'
import ContentWindow from 'components/ContentWindow'
import { showLinkEditWindow } from '../HomePage/actions'
import { WindowWrapper, Window } from 'elements/window'
import Overlay from 'components/Overlay'
import { setPopupMessage } from '../App/actions'
import { getUpDownText } from 'utils/tags'
import * as e from './elements'

export class LinkPreviewWindow extends Component {
  lpwForward = () => {
    const { previewWindowHistory, previewWindowHistoryIndex } = this.props
    this.showPreviewWindow(previewWindowHistory[previewWindowHistoryIndex + 1])
  }
  lpwBack = () => {
    const { previewWindowHistory, previewWindowHistoryIndex } = this.props
    this.showPreviewWindow(previewWindowHistory[previewWindowHistoryIndex - 1])
  }

  showPreviewWindow = (target) => {
    const { hideWindow, showNodePreview, focusNode, nodes, showPreview } = this.props
    if (target.startId) {
      hideWindow()
      nodes[target.startId] && focusNode(target.startId)
      showPreview(target.startId, target.stopId)
    } else {
      hideWindow()
      nodes[target.id] && focusNode(target.id)
      showNodePreview(target.id, target.name)
    }
  }
  showEditWindow = () => {
    this.props.showLinkEditWindow(
      this.props.linkPreviewWindow.stopNode._id,
      this.props.linkPreviewWindow.startNode._id
    )
  }
  titleRenderer = () => {
    const {
      startNode,
      stopNode,
      linkDetails = {},
    } = this.props.linkPreviewWindow
    const downText = getUpDownText(linkDetails._type, linkDetails.name).down

    return (
      <div>
        <e.TitleLink onClick={() => this.showPreviewWindow({ id: startNode._id, name: startNode.title })} >{startNode.title}</e.TitleLink>
        {` ${downText} `}
        <e.TitleLink onClick={() => this.showPreviewWindow({ id: stopNode._id, name: stopNode.name })} >{stopNode.title}</e.TitleLink>
      </div>
    )
  }
  render () {
    let {
      show,
      // startNode is the child
      startNode,
      // stopNode is the parent
      stopNode,
      // linkDetails can be undefined when the link doesn't exist in the database
      // such as links from a venn diagram node to its children
      linkDetails = {},
    } = this.props.linkPreviewWindow
    const {
      hideWindow,
      nodes,
      previewWindowHistory,
      previewWindowHistoryIndex,
    } = this.props

    if (!show) {
      return null
    }

    if (!startNode || !stopNode) {
      return <WindowWrapper zIndex={4}>
        <Overlay onClose={this.props.hideWindow} />
        <Window width={'560px'}>
          Loading...
        </Window>
      </WindowWrapper>
    }

    let nextNode, prevNode
    if (previewWindowHistoryIndex >= 0 && previewWindowHistoryIndex < previewWindowHistory.length) {
      const selectNext = previewWindowHistory[previewWindowHistoryIndex + 1]
      const selectPrev = previewWindowHistory[previewWindowHistoryIndex - 1]
      if (selectNext && selectNext.startId) { // Is LPW
        nextNode = { title: `${nodes[selectNext.startId].title} is related to ${nodes[selectNext.stopId].title}` }
      } else {
        nextNode = selectNext
      }

      if (selectPrev && selectPrev.startId) {
        prevNode = { title: `${nodes[selectPrev.startId].title} is related to ${nodes[selectPrev.stopId].title}` }
      } else {
        prevNode = selectPrev
      }
    }

    return (
      <ContentWindow
        title={this.titleRenderer()}
        showPreviewWindow={this.showPreviewWindow}
        linkPreview
        hideWindow={hideWindow}
        showEditWindow={this.showEditWindow}
        definition={linkDetails.definition}
        item={linkDetails}

        lpwBack={this.lpwBack}
        lpwForward={this.lpwForward}
        nextNode={nextNode}
        prevNode={prevNode}
      />
    )
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    hideWindow: () => {
      dispatch(hidePreview())
      dispatch(hide())
    },
    showPreview: (start, stop) => {
      dispatch(showPreview(start, stop))
    },
    showNodePreview: (id, name) => {
      dispatch(show(id, name))
    },
    openLinkPreviewWindowFor: childId => {
      dispatch(openLinkPreviewWindowFor(childId))
    },
    focusNode: id => dispatch(focusNode(id)),
    setPopupMessage: params => {
      dispatch(setPopupMessage(params))
    },
    showLinkEditWindow (parentId, childId) {
      dispatch(showLinkEditWindow(parentId, childId))
    },
    dispatch,
  }
}

const mapStateToProps = createStructuredSelector({
  linkPreviewWindow: selectLinkPreviewWindow(),
  nodePreviewWindow: selectNodePreviewWindow(),
  previewWindowHistory: selectPreviewWindowHistory(),
  previewWindowHistoryIndex: selectPreviewWindowHistoryIndex(),
  nodes: selectNodes,
})

export default connect(mapStateToProps, mapDispatchToProps)(LinkPreviewWindow)
