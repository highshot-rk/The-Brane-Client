import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  show,
  hide,
  toggleLinkSidebar,
  hideNodeCreationDetails,
} from './actions'
import { showPreview, hidePreview } from '../LinkPreviewWindow/actions'
import { selectNodePreviewWindow } from './selectors'
import { openLinkPreviewWindowFor, focusNode, addNode } from '../FixedPath/actions'
import { selectNodes, selectOpenLPWfor } from 'containers/FixedPath/selectors'
import { selectPreviewWindowHistory, selectPreviewWindowHistoryIndex } from '../HomePage/selectors'
import { showNodeEditWindow, showNodeCreationWindow } from '../HomePage/actions'
import ContentWindow from 'components/ContentWindow'
import { createStructuredSelector } from 'reselect'
import { INFO_COLOR } from '../../styles/colors'
import * as KEYBOARD_CODES from '../../utils/key-codes'
import selectLineageTool from '../LineageTool/selectors'
import { setPopupMessage } from '../App/actions'
import {
  uploadNodePicture,
  removeUpload,
} from 'api/node'
import { ensureProtocol } from 'utils/url'
import * as e from './elements'
import * as Layout from 'elements/layout'
import Icon from 'components/Icon'
import LinkSidebar from 'components/ContentWindow/LinkSidebar'
import AfterCreationSuggestions from 'components/ContentWindow/AfterCreationSuggestions'
import { symbolFromQueryType } from 'utils/venn'
import PropTypes from 'prop-types'

export class NodePreviewWindowContainer extends Component {
  static propTypes = {
    nodePreviewWindow: PropTypes.shape({
      node: PropTypes.object,
      show: PropTypes.bool,
      reference: PropTypes.object,
      relatives: PropTypes.arrayOf(PropTypes.object),
      showLinkSidebar: PropTypes.bool,
      creationDetails: PropTypes.shape({
        initialParentId: PropTypes.string,
        initialParentTitle: PropTypes.string,
      }),
      loading: PropTypes.bool,
      confidenceInfoActive: PropTypes.bool,
      showAddPublication: PropTypes.bool,
      showAddConfidence: PropTypes.bool,
      image: PropTypes.object,
      numbers: PropTypes.object,
      expandActive: PropTypes.bool,
    }),
    setPopupMessage: PropTypes.func,
    openLinkPreviewWindowFor: PropTypes.func,
    nodes: PropTypes.arrayOf(PropTypes.object),
    previewWindowHistory: PropTypes.arrayOf(PropTypes.object),
    previewWindowHistoryIndex: PropTypes.number,
    lineageTool: PropTypes.shape({
      history: PropTypes.arrayOf(PropTypes.object),
    }),
    addNode: PropTypes.func,
    hideWindow: PropTypes.func,
    showWindow: PropTypes.func,
    focusNode: PropTypes.func,
    showPreview: PropTypes.func,
    showNodeCreationWindow: PropTypes.func,
    showNodeEditWindow: PropTypes.func,
    toggleLinkSidebar: PropTypes.func,
    hideCreationDetails: PropTypes.func,
    toggleConfidenceInfo: PropTypes.func,
  }
  state = {
    picture: null,
  }

  showPopupMessage = msj => {
    this.props.setPopupMessage({
      show: true,
      message: msj,
      bgColor: INFO_COLOR,
    })
  }
  showLinkPreview = (relative) => {
    const findCurrent = Object.keys(this.props.nodes).filter(id => id === relative._id)
    const forward = findCurrent.length === 1

    const { node } = this.props.nodePreviewWindow
    this.props.openLinkPreviewWindowFor({ from: node._id, to: relative._id, forward })
  }

  lpwForward = () => {
    const { previewWindowHistory, previewWindowHistoryIndex } = this.props
    this.showPreviewWindow(previewWindowHistory[previewWindowHistoryIndex + 1])
  }
  lpwBack = () => {
    const { previewWindowHistory, previewWindowHistoryIndex } = this.props
    this.showPreviewWindow(previewWindowHistory[previewWindowHistoryIndex - 1])
  }

  keyForward = () => {
    const { history } = this.props.lineageTool
    if (history && history.length > 1) {
      const currentTargetIndex = history.findIndex(item => item.active)
      const target = history[currentTargetIndex + 1]
      target && this.showPreviewWindow(target)
    }
  }

  keyBack = () => {
    const { history } = this.props.lineageTool
    if (history && history.length > 1) {
      const currentTargetIndex = history.findIndex(item => item.active)
      const target = history[currentTargetIndex - 1]
      target && this.showPreviewWindow(target)
    }
  }

  showPreviewWindow = (target) => {
    if (target._id && !this.props.nodes[target._id]) {
      this.props.addNode({
        id: target._id,
        title: target.title,
      }, target.nodeId, 0)
    }
    if (target.startId) {
      this.openPreviewWindow({
        startId: target.startId,
        stopId: target.stopId,
      })
    } else if (target._id) {
      this.openPreviewWindow({
        startId: target._id,
        name: target.title,
      })
    } else {
      this.openPreviewWindow({
        startId: target.id,
        name: target.name,
      })
    }
  }

  openPreviewWindow = ({ startId, stopId, name }) => {
    const { hideWindow, showWindow, focusNode, nodes, showPreview } = this.props
    hideWindow()
    nodes[startId] && focusNode(startId)
    stopId ? showPreview(startId, stopId) : showWindow(startId, name)
  }
  onNodeImageDropped = imageData => {
    this.setState({ picture: imageData[0] })
  }

  updateImage = (nodeId, picture) => {
    return uploadNodePicture(nodeId, picture)
  }

  removeImages = (nodeKey, uploads) => {
    return removeUpload(nodeKey)
  }

  onSaveNodeImage = async () => {
    const { _id, t: title } = this.props.nodePreviewWindow.node
    await this.updateImage(_id, this.state.picture)
    await this.removeImages(_id)
    this.showPopupMessage(`Saved changes to ${title}`)
    this.props.showWindow(_id, title)
    this.setState({ picture: null })
  }

  nodePreviewWindowKeyHandler = (event) => {
    if (!this.props.nodePreviewWindow.show) { return }
    switch (event.keyCode) {
      case KEYBOARD_CODES.ARROW_RIGHT:
        this.keyForward()
        break
      case KEYBOARD_CODES.ARROW_LEFT:
        this.keyBack()
        break
      case KEYBOARD_CODES.ESCAPE:
        this.props.hideWindow()
        break
      default: break
    }
  }
  componentWillMount () {
    document.addEventListener('keydown', this.nodePreviewWindowKeyHandler)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.nodePreviewWindowKeyHandler)
  }
  showNodeCreation = (parentId) => {
    this.props.showNodeCreationWindow(parentId)
    this.props.hideWindow()
  }
  showEditWindow = () => {
    this.props.showNodeEditWindow(this.props.nodePreviewWindow.node._id)
  }

  onHideWindow = () => {
    this.setState({ picture: null })
    this.props.hideWindow()
  }
  renderNodeName = () => {
    const {
      node: {
        vennIds,
        additionalProperties = {},
        title,
      },
    } = this.props.nodePreviewWindow

    if (vennIds) {
      return vennIds.map((query, i) => ([
        i > 0 ? <e.VennOperator>{symbolFromQueryType(query.type)}</e.VennOperator> : null,
        ' ',
        <e.VennPart onClick={() => this.showPreviewWindow({ _id: query.id, title: query.query })}>{query.query}</e.VennPart>,
      ]))
    } else if (additionalProperties && additionalProperties.reference) {
      return <a href={ensureProtocol(additionalProperties.reference)} target='_blank'>{title}</a>
    } else {
      return title
    }
  }
  titleRenderer = () => {
    const {
      relatives,
    } = this.props.nodePreviewWindow
    const {
      toggleLinkSidebar,
    } = this.props

    return (
      <>
        {this.renderNodeName()}
        {/* {reference ? <a href={ensureProtocol(reference)} target='_blank'>{node.title}</a> : node.title} */}
        {relatives.length ? (
          <Layout.Row
            style={{ marginLeft: 20, cursor: 'pointer' }}
            onClick={toggleLinkSidebar}
          >
            <Icon name='link-straight' width={16} height={16} />
            <e.LinkCount>{`(${relatives.length})`}</e.LinkCount>

          </Layout.Row>
        ) : null}
      </>
    )
  }

  renderSidebar = (nextNode, prevNode) => {
    const {
      toggleLinkSidebar,
      hideCreationDetails,
    } = this.props
    const {
      node,
      relatives,
      showLinkSidebar,
      creationDetails,
    } = this.props.nodePreviewWindow

    if (showLinkSidebar) {
      return <LinkSidebar
        hasNavBar={nextNode || prevNode}
        showLinkPreview={this.showLinkPreview}
        showPreviewWindow={this.showPreviewWindow}
        toggleLinkSidebar={toggleLinkSidebar}
        parent={node._id}
        nodeTitle={node.title}
        links={relatives}
      />
    }

    if (creationDetails) {
      return <AfterCreationSuggestions
        parentId={creationDetails.initialParentId}
        parentTitle={creationDetails.initialParentTitle}
        title={node.title}
        nodeId={node._id}
        onClose={hideCreationDetails}
        showNodeCreationWindow={this.showNodeCreation}
      />
    }
  }

  render () {
    const {
      toggleConfidenceInfo,
      nodes,
      previewWindowHistory,
      previewWindowHistoryIndex,
    } = this.props
    const {
      show,
      loading,
      expandActive,
      confidenceInfoActive,
      node,
      image,
      numbers,
    } = this.props.nodePreviewWindow

    if (!show) {
      return null
    }

    let nextNode, prevNode
    if (previewWindowHistoryIndex >= 0 && previewWindowHistoryIndex < previewWindowHistory.length) {
      const selectNext = previewWindowHistory[previewWindowHistoryIndex + 1]
      const selectPrev = previewWindowHistory[previewWindowHistoryIndex - 1]
      if (selectNext && selectNext.startId) { // Is LPW
        nextNode = { name: `${nodes[selectNext.startId].name} is related to ${nodes[selectNext.stopId].name}` }
      } else {
        nextNode = selectNext
      }

      if (selectPrev && selectPrev.startId) {
        prevNode = { name: `${nodes[selectPrev.startId].name} is related to ${nodes[selectPrev.stopId].name}` }
      } else {
        prevNode = selectPrev
      }
    }
    return (<ContentWindow
      title={this.titleRenderer()}
      definition={node.definition}
      image={image}
      numbers={numbers}
      sidebar={this.renderSidebar(nextNode, prevNode)}
      loading={loading}
      showEditWindow={this.showEditWindow}
      hideWindow={this.onHideWindow}
      item={node}

      saveNodeImage={this.onSaveNodeImage}
      previewImg={this.state.picture}
      showPreviewWindow={this.showPreviewWindow}
      onNodeImageDropped={this.onNodeImageDropped}

      lpwForward={this.lpwForward}
      lpwBack={this.lpwBack}
      nextNode={nextNode}
      prevNode={prevNode}

      expandActive={expandActive}
      confidenceInfoActive={confidenceInfoActive}
      toggleConfidenceInfo={toggleConfidenceInfo}
    />)
  }
}

export const mapDispatchToProps = {
  showWindow: show,
  showPreview,
  hidePreview: hidePreview,
  hideWindow: hide,
  toggleLinkSidebar,
  openLinkPreviewWindowFor,
  showNodePreview: show,
  focusNode,
  setPopupMessage,
  showNodeEditWindow,
  showNodeCreationWindow,
  hideCreationDetails: hideNodeCreationDetails,
  addNode,
}

const mapStateToProps = createStructuredSelector(
  {
    nodePreviewWindow: selectNodePreviewWindow(),
    openLPWValue: selectOpenLPWfor,
    nodes: selectNodes,
    previewWindowHistory: selectPreviewWindowHistory(),
    previewWindowHistoryIndex: selectPreviewWindowHistoryIndex(),
    lineageTool: selectLineageTool(),
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(NodePreviewWindowContainer)
