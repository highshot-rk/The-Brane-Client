import React, { Component } from 'react'
import NavigationBottomBar from '../../components/NavigationBottomBar'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectFocusedNodeId, selectHistory, selectActivePathId, selectAllOrbitsLocked, selectZoomValue, selectProgress, selectNodes } from 'containers/FixedPath/selectors'
import { zoomIn, zoomOut, centerOnFocused, toggleAllOrbits, previousHistory, nextHistory } from '../FixedPath/actions'
import { closeBottombarMenu } from '../HomePage/actions'
import * as KEYBOARD_CODES from '../../utils/key-codes'
import { selectShowNodePreviewWindow } from '../NodePreviewWindow/selectors'
import { createStructuredSelector } from 'reselect'
import { selectSidebarMenu, selectBottombarMenu } from '../HomePage/selectors'
import { selectPathWindowFocused } from 'containers/LineageTool/selectors'
import { BRANE_NODE_ID } from '../../constants'
import ExportTopics from 'components/ExportTopics'
import Dialog from 'components/Dialog'
import AdvanceDialog from 'components/AdvanceDialog'

class NavigationBottomBarContainer extends Component {
  static propTypes = {
    centerOnFocused: PropTypes.func,
    focusChild: PropTypes.func,
    singleNodeView: PropTypes.object,
    focusedId: PropTypes.string,
    history: PropTypes.array,
    zoomIn: PropTypes.func,
    zoomOut: PropTypes.func,
    exportTopics: PropTypes.func,
    overlayOpen: PropTypes.bool,
    menuopen: PropTypes.func,
    toggleAllOrbits: PropTypes.func,
    activePath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    allOrbitsLocked: PropTypes.bool,
    zoomValue: PropTypes.number,
    previousHistory: PropTypes.func,
    nextHistory: PropTypes.func,
    sideBarMenu: PropTypes.string,
    closeBottombarMenu: PropTypes.func,
    bottomBarMenu: PropTypes.string,
    progress: PropTypes.number,
    nodes: PropTypes.object,
  }
  state = { changing: false }

  tagFilterCount = new Map()

  keyPressHandler = (event) => {
    if (event.ctrlKey) {
      switch (event.keyCode) {
        case KEYBOARD_CODES.PLUS:
          this.props.zoomIn()
          break
        case KEYBOARD_CODES.MINUS:
          this.props.zoomOut()
          break
        default: break
      }
    }
  }

  focusChild = KEY => {
    this.setState({ changing: true })
    setTimeout(() => {
      this.props.focusChild(KEY)
      this.setState({ changing: false })
    }, 100)
  }

  keyDownHandler = (event) => {
    if (
      this.props.overlayOpen ||
      !this.enabled()
    ) {
      return
    }

    switch (event.keyCode) {
      case KEYBOARD_CODES.ARROW_LEFT:
        this.props.previousHistory()
        break
      case KEYBOARD_CODES.ARROW_RIGHT:
        this.props.nextHistory()
        break
      case KEYBOARD_CODES.ARROW_UP:
        if (!this.state.changing) {
          this.focusChild(KEYBOARD_CODES.ARROW_UP)
        }
        break
      case KEYBOARD_CODES.ARROW_DOWN:
        if (!this.state.changing) {
          this.focusChild(KEYBOARD_CODES.ARROW_DOWN)
        }
        break
      case KEYBOARD_CODES.ESCAPE:
        this.props.focusChild(KEYBOARD_CODES.ESCAPE)
        break
      // no default
    }
  }
  componentWillMount () {
    document.addEventListener('keypress', this.keyPressHandler)
    document.addEventListener('keydown', this.keyDownHandler)
  }
  componentWillUnmount () {
    document.removeEventListener('keypress', this.keyPressHandler)
    document.removeEventListener('keydown', this.keyDownHandler)
  }

  enabled = () => {
    const {
      focusedId,
      history,
      activePath,
      singleNodeView,
      sideBarMenu,
    } = this.props

    if (singleNodeView.show || sideBarMenu) {
      return false
    }

    return focusedId !== BRANE_NODE_ID || history.length > 1 || typeof activePath !== 'number'
  }
  render () {
    const {
      zoomIn,
      zoomOut,
      centerOnFocused,
      toggleAllOrbits,
      exportTopics,
      allOrbitsLocked,
      zoomValue,
      previousHistory,
      nextHistory,
      bottomBarMenu,
      menuopen,
      closeBottombarMenu,
      progress,
      nodes,
      history,
      focusedId,
    } = this.props

    if (!this.enabled()) {
      return null
    }
    let title = `Exporting ${progress}`
    let content = 'Please wait. Files will be download via your browser'
    if (progress === 100) {
      title = '100% - Download competed!'
      content = 'Congratulation! Your file is now available on your desktop'
    }
    return (
      <div>
        {
          (bottomBarMenu === 'open') && (
            <ExportTopics open={menuopen} exportTopics={exportTopics} />
          )
        }
        {
          (bottomBarMenu === 'all' || bottomBarMenu === 'current') && (
            <Dialog
              title={title}
              text={content}
              buttons={[ {
                text: 'Done',
                style: 'normal',
                negative: false,
              },
              ]}
              onClick={closeBottombarMenu}
            />
          )
        }
        {
          (bottomBarMenu === 'advanced') && (
            <AdvanceDialog
              close={closeBottombarMenu}
              nodes={nodes}
              history={history}
              exportTopics={exportTopics}
              focusedId={focusedId}
              progress={progress}
            />
          )
        }
        <NavigationBottomBar
          allOrbitsLocked={allOrbitsLocked}
          toggleAllOrbits={toggleAllOrbits}
          zoomLevel={`${zoomValue * 100}%`}
          navPrevious={previousHistory}
          navForward={nextHistory}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          centerFocused={centerOnFocused}
          menuopen={menuopen}
          close={closeBottombarMenu}
          bottomBarMenu={bottomBarMenu}
          exportTopics={exportTopics}
        />
      </div>
    )
  }
}

const mapDispatchToProps = {
  zoomIn,
  zoomOut,
  centerOnFocused,
  toggleAllOrbits,
  previousHistory,
  nextHistory,
  closeBottombarMenu,
}

const mapStateToProps = createStructuredSelector({
  isNodePreviewWindowOpen: selectShowNodePreviewWindow,
  sideBarMenu: selectSidebarMenu(),
  selectPathWindowFocused: selectPathWindowFocused,
  focusedId: selectFocusedNodeId,
  history: selectHistory,
  activePath: selectActivePathId,
  allOrbitsLocked: selectAllOrbitsLocked,
  zoomValue: selectZoomValue,
  bottomBarMenu: selectBottombarMenu(),
  progress: selectProgress,
  nodes: selectNodes,
})

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBottomBarContainer)
