/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import {
  addProfileNode,
  closeSidebarMenu,
  openSidebarMenu,
  closeNodeCreationWindow,
  hideNodeEditWindow,
  showNodeCreationWindow,
  openProfileMenu,
  closeProfileMenu,
  showNodeEditWindow,
  hideLinkEditWindow,
  showLinkCreationWindow,
  closeLinkCreationWindow,
  showClearPathDialog,
  hideAllOverlays,
  openBottombarMenu,
} from './actions'
import {
  startSearch,
  expandBranch,
  newSearchConfirm,
  newSearchCancel,
  hideMenu,
  updateNodes,
  restoreSavedPath,
  focusChild,
  exportTopics,
} from '../FixedPath/actions'
import {
  selectNodeCreationWindow,
  selectSidebarMenu,
  selectNodeEditWindow,
  selectShowProfileMenu,
  selectLinkEditWindow,
  selectLinkCreationWindow,
  selectShowClearPathDialog,
} from './selectors'
import {
  selectFocusedNode,
  selectUnconfirmedSearch,
  selectActivePathId,
  selectBranchPipeline,
  selectSingleNodeView,
  selectMenu,
} from '../FixedPath/selectors'
import { showPreview } from '../LinkPreviewWindow/actions'
import { show } from '../NodePreviewWindow/actions'
import Dropup from 'components/Dropup'
import FilterMenu from 'containers/FilterMenu'
import Search from 'containers/Search'
import FixedPath from 'containers/FixedPath/index.tsx'
import LinkPreviewWindow from 'containers/LinkPreviewWindow'
import NodePreviewWindow from 'containers/NodePreviewWindow'
import NodeEditWindow from 'components/NodeEditWindow'
import LineageTool from 'containers/LineageTool'
import Sidebar from 'components/Sidebar'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import NodeCreationWindow from '../../components/NodeCreationWindow'
import NavigationBottomBar from '../NavigationBottomBar'
import ConfirmPathDisruption from '../../components/ConfirmPathDisruption'
import EditLinkWindow from 'components/EditLinkWindow'
import LinkCreationWindow from 'components/LinkCreationWindow'
import { selectAuth, selectAllowedGraphs } from '../Auth/selectors'
import { setPopupMessage } from '../App/actions'
import { ThemeProvider } from 'styled-components'
import { selectShowNodePreviewWindow, selectNodePreviewWindow } from '../NodePreviewWindow/selectors'
import { selectLinkPreviewWindow } from '../LinkPreviewWindow/selectors'
import { hot } from 'react-hot-loader'
import ExpandedSideBar from 'components/ExpandedSideBar'
import { selectPaths, selectActivePathIndex } from 'containers/LineageTool/selectors'
import { featureEnabled } from 'utils/features'
import PropertyFilters from 'containers/PropertySidebar'
import { selectFocusedNodeHasProperties } from 'containers/PropertySidebar/selectors'
import { composeHomeReducer } from './reducer'
import { composeAuthReducer, logout } from 'containers/Auth/reducer'
import { composeFixedPathReducer } from 'containers/FixedPath/reducer'
import { composeLineageReducer } from 'containers/LineageTool/reducer'
import { composeNodeContentWindowReducer } from 'containers/NodePreviewWindow/reducer'
import { composeLinkContentWindowReducer } from 'containers/LinkPreviewWindow/reducer'
import { composeFilterMenuReducer } from 'containers/FilterMenu/reducer'
import { composeSearchReducer } from 'containers/Search/reducer'
import { composePropertyReducer } from 'containers/PropertySidebar/reducer'
import { GRAPH_NAME } from '../../constants'
import LogRocket from 'logrocket'
import Unauthorized from './unauthorized'
import { Redirect } from 'react-router'

const emailList = [
  'mikael@thebrane.com',
  'mik382010@msn.com',
  'mik.heroux.vaillancourt@gmail.com',
  'mikael.heroux-vaillancourt@polymtl.ca',
  'nicolas@thebrane.com',
  'nicolashugues@gmail.com',
  'zach.stecko@gmail.com',
  'olivierlizotte@gmail.com',
  'pierre.degourcy@gmail.com',
  'pierre@thebrane.com',
  'catherine.desrochers@gmail.com',
  'z-modern@live.com',
  'stephane@spaulconsultant.com',
  'tansuongkevin@gmail.com',
  'josuelp17@gmail.com',
  'sinamonta@gmail.com',
]

class HomePage extends Component {
  state ={
    emailConfirmed: false,
  }

  static propTypes = {
    focusChild: PropTypes.func,
    openSidebarMenu: PropTypes.func,
    closeSidebarMenu: PropTypes.func,
    hideNodeMenu: PropTypes.func,
    auth: PropTypes.shape({
      userId: PropTypes.string,
      onboarded: PropTypes.boolean,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    nodeCreationWindow: PropTypes.object,
    linkCreationWindow: PropTypes.object,
    linkEditWindow: PropTypes.object,
    nodeEditWindow: PropTypes.object,
    sideBarMenu: PropTypes.string,
    branchPipeline: PropTypes.object,
    unconfirmedSearch: PropTypes.object,
    nodePreviewWindow: PropTypes.object,
    linkPreviewWindow: PropTypes.object,
    showClearPathDialog: PropTypes.bool,
    showNodeCreationWindow: PropTypes.func,
    startSearch: PropTypes.func,
    focusedNode: PropTypes.object,
    closeNodeCreationWindow: PropTypes.func,
    addProfileNode: PropTypes.func,
    expandCollapsedUserProfile: PropTypes.func,
    newSearchCancel: PropTypes.func,
    newSearchConfirm: PropTypes.func,
    setPopupMessage: PropTypes.func,
    hideNodeEditWindow: PropTypes.func,
    hideLinkEditWindow: PropTypes.func,
    hideAllOverlays: PropTypes.func,
    showProfileMenu: PropTypes.func,
    openProfileMenu: PropTypes.func,
    closeProfileMenu: PropTypes.func,
    logout: PropTypes.func,
    showLinkPreview: PropTypes.func,
    showNodePreview: PropTypes.func,
    showNodeEditWindow,
    showLinkCreationWindow: PropTypes.func,
    closeLinkCreationWindow: PropTypes.func,
    updateNodes: PropTypes.func,
    singleNodeView: PropTypes.func,
    onShowClearPathDialog: PropTypes.func,
    nodeMenu: PropTypes.any,
    lineagePaths: PropTypes.any,
    activePathIndex: PropTypes.any,
    exportTopics: PropTypes.any,
    focusedNodeHasProperties: PropTypes.any,
    openBottombarMenu: PropTypes.any,
    children: PropTypes.any,
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    allowedGraphs: PropTypes.arrayOf(PropTypes.string),
  }

  async componentDidMount () {
    try {
      const email = this.props.auth.authToken.user.email
      const found = emailList.includes(email)

      if (found) {
        LogRocket.identify(this.props.auth.firstName + ' ' + this.props.auth.lastName)
      } else {
        LogRocket.identify()
      }
    } catch (e) {
      console.log(e)
    }
    const result = await this.check()
    if (!result) {
      console.log('Mobile view is not optimized yet :(')
      this.props.history.push('/error')
    }
  }

  openSidebarMenu = (menuItemId) => {
    this.props.hideNodeMenu()
    this.props.openSidebarMenu(menuItemId)
  }
  overlayOpen = () => {
    return !!(this.props.nodeCreationWindow.visible ||
      this.props.linkCreationWindow.visible ||
      this.props.nodeEditWindow.show ||
      this.props.linkEditWindow.show ||
      this.props.sideBarMenu ||
      this.props.branchPipeline.show ||
      this.props.unconfirmedSearch ||
      this.props.nodePreviewWindow.show ||
      this.props.linkPreviewWindow.show ||
      this.props.showClearPathDialog)
  }

  check = async () => {
    const documentElement = document.documentElement
    const body = document.getElementsByTagName('body')[0]
    const windowWidth = window.innerWidth || documentElement.clientWidth || body.clientWidth // window width
    return windowWidth > 700 // returns true for widths larger than 700 pixels
  }

  render () {
    const {
      openSidebarMenu,
      closeSidebarMenu,
      sideBarMenu,
      nodeCreationWindow,
      showNodeCreationWindow,
      startSearch,
      focusedNode,
      closeNodeCreationWindow,
      expandCollapsedUserProfile,
      unconfirmedSearch,
      newSearchCancel,
      newSearchConfirm,
      addProfileNode,
      setPopupMessage,
      nodeEditWindow,
      hideNodeEditWindow,
      linkEditWindow,
      hideLinkEditWindow,
      hideAllOverlays,
      showProfileMenu,
      openProfileMenu,
      closeProfileMenu,
      logout,
      showLinkPreview,
      showNodePreview,
      auth,
      showNodeEditWindow,
      showLinkCreationWindow,
      closeLinkCreationWindow,
      linkCreationWindow,
      updateNodes,
      singleNodeView,
      showClearPathDialog,
      onShowClearPathDialog,
      nodeMenu,
      lineagePaths,
      activePathIndex,
      exportTopics,
      focusedNodeHasProperties,
      openBottombarMenu,
      match,
      allowedGraphs,
    } = this.props
    const overlayOpen = this.overlayOpen()

    const graphName = match.params.graphName
    if (graphName !== GRAPH_NAME) {
      window.location.reload()
      return null
    }

    if (!allowedGraphs.includes(graphName)) {
      if (allowedGraphs.length === 1) {
        return <Redirect to={`/graph/${allowedGraphs[0]}`} />
      }
      if (allowedGraphs.length > 0) {
        return <Unauthorized allowedGraphs={allowedGraphs} />
      }
    }

    return (
      <ThemeProvider theme={{
        appearSpeed: auth.onboarded ? 1 : 0.5,
      }}>
        <div>
          {featureEnabled('dropup') &&
            <Dropup
              userId={auth.userId}
              profile={{ firstName: auth.firstName, lastName: auth.lastName }}
              expandCollapsedUserProfile={expandCollapsedUserProfile}
              addProfileNode={addProfileNode}
              showProfileMenu={showProfileMenu}
              openProfileMenu={openProfileMenu}
              closeProfileMenu={closeProfileMenu}
            />
          }
          <FixedPath overlayOpen={overlayOpen} />
          <LineageTool nodeMenuOpen={nodeMenu} />
          <Search
            open={() => openSidebarMenu('search')}
            panelVisible={sideBarMenu === 'search'}
            overlayOpen={overlayOpen}
            close={closeSidebarMenu}
          />
          {sideBarMenu === 'expand' &&
            <ExpandedSideBar userId={auth.userId} auth={auth.authToken} logout={logout} close={closeSidebarMenu} />
          }
          <Sidebar
            showClearPathDialog={showClearPathDialog}
            onShowClearPathDialog={onShowClearPathDialog}
            newSearchConfirm={newSearchConfirm}
            lineagePaths={lineagePaths}
            activePathIndex={activePathIndex}
            open={(...props) => {
              hideAllOverlays()
              openSidebarMenu(...props)
            }}
            highlighted={
              focusedNodeHasProperties ? 'properties' : ''
            }
            showOverlay={sideBarMenu === 'search'}
            close={closeSidebarMenu}
            showNodeCreationWindow={showNodeCreationWindow}
            active={sideBarMenu}
          />
          <LinkPreviewWindow />
          <NodePreviewWindow />
          {nodeEditWindow.show && <NodeEditWindow
            nodeId={nodeEditWindow.nodeId}
            onClose={() => {
              showNodePreview(nodeEditWindow.nodeId)
              hideNodeEditWindow()
            }}
            showLinkPreview={showLinkPreview}
            setPopupMessage={setPopupMessage}
            updateNodes={updateNodes}
          />}
          {
            linkEditWindow.show && <EditLinkWindow
              parentId={linkEditWindow.parentId}
              childId={linkEditWindow.childId}
              onClose={() => {
                hideLinkEditWindow()
                showLinkPreview(
                  linkEditWindow.childId,
                  linkEditWindow.parentId
                )
              }}
              setPopupMessage={setPopupMessage}
            />
          }
          {nodeCreationWindow.visible && (
            <NodeCreationWindow
              parentId={nodeCreationWindow.parentId}
              title={nodeCreationWindow.title}
              setPopupMessage={setPopupMessage}
              startSearch={startSearch}
              focusedNode={focusedNode}
              onClose={closeNodeCreationWindow}
              showNodePreviewWindow={showNodePreview}
              showLinkCreationWindow={showLinkCreationWindow}
              showNodeEditWindow={nodeId => {
                closeNodeCreationWindow()
                showNodeEditWindow(nodeId)
              }}
              updateNodes={updateNodes}
            />
          )}
          {linkCreationWindow.visible && <LinkCreationWindow
            showBack={nodeCreationWindow.visible}
            replace={linkCreationWindow.replace}
            parentLink={linkCreationWindow.parentLink}
            childLink={linkCreationWindow.childLink}
            setPopupMessage={setPopupMessage}
            onClose={closeLinkCreationWindow}
            showNodeCreationWindow={showNodeCreationWindow}
            updateNodes={updateNodes}
          />}
          {unconfirmedSearch && (
            <ConfirmPathDisruption
              unconfirmedSearch={unconfirmedSearch}
              cancel={newSearchCancel}
              confirm={newSearchConfirm}
            />
          )}
          <FilterMenu
            panelVisible={sideBarMenu === 'filter'}
            open={() => openSidebarMenu('filter')}
            close={closeSidebarMenu}
          />

          <PropertyFilters
            panelVisible={sideBarMenu === 'properties'}
            close={closeSidebarMenu}
            open={() => openSidebarMenu('properties')}
          />
          <NavigationBottomBar
            nodeCreationWindowOpen={nodeCreationWindow.visible}
            singleNodeView={singleNodeView}
            focusChild={direction => this.props.focusChild({ direction, id: new Date().getTime() })}
            exportTopics={exportTopics}
            overlayOpen={overlayOpen}
            menuopen={openBottombarMenu}
          />
          {this.props.children}
        </div>
      </ThemeProvider>
    )
  }
}

const mapDispatchToProps = {
  addProfileNode,
  expandCollapsedUserProfile: expandBranch,
  closeNodeCreationWindow,
  openSidebarMenu,
  closeSidebarMenu,
  newSearchConfirm: newSearchConfirm,
  newSearchCancel: newSearchCancel,
  startSearch,
  hideNodeMenu: hideMenu,
  showNodeCreationWindow,
  showLinkCreationWindow,
  closeLinkCreationWindow,
  hideNodeEditWindow,
  openProfileMenu,
  closeProfileMenu,
  restoreSavedPath,
  logout: logout,
  showLinkPreview: showPreview,
  showNodePreview: show,
  showNodeEditWindow,
  hideLinkEditWindow,
  updateNodes,
  setPopupMessage,
  focusChild,
  onShowClearPathDialog: showClearPathDialog,
  hideAllOverlays,
  exportTopics,
  openBottombarMenu,
}

const mapStateToProps = createStructuredSelector({
  nodeCreationWindow: selectNodeCreationWindow(),
  linkCreationWindow: selectLinkCreationWindow(),
  sideBarMenu: selectSidebarMenu(),
  focusedNode: selectFocusedNode,
  unconfirmedSearch: selectUnconfirmedSearch,
  nodeEditWindow: selectNodeEditWindow(),
  linkEditWindow: selectLinkEditWindow(),
  showProfileMenu: selectShowProfileMenu(),
  activePathId: selectActivePathId,
  auth: selectAuth,
  singleNodeView: selectSingleNodeView,
  showClearPathDialog: selectShowClearPathDialog(),
  showNodePreviewWindow: selectShowNodePreviewWindow(),
  branchPipeline: selectBranchPipeline,
  nodePreviewWindow: selectNodePreviewWindow(),
  linkPreviewWindow: selectLinkPreviewWindow(),
  nodeMenu: selectMenu,
  lineagePaths: selectPaths(),
  activePathIndex: selectActivePathIndex(),
  focusedNodeHasProperties: selectFocusedNodeHasProperties(),
  allowedGraphs: selectAllowedGraphs,
})

export default hot(module)(compose(
  ...composeHomeReducer,
  ...composeAuthReducer,
  ...composeFixedPathReducer,
  ...composeLineageReducer,
  ...composeNodeContentWindowReducer,
  ...composeLinkContentWindowReducer,
  ...composeFilterMenuReducer,
  ...composeSearchReducer,
  ...composePropertyReducer
)(connect(mapStateToProps, mapDispatchToProps)(HomePage)))
