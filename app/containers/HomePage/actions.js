import {
  CLOSE_SIDEBAR_MENU,
  OPEN_SIDEBAR_MENU,
  SHOW_NODE_CREATION_WINDOW,
  CLOSE_NODE_CREATION_WINDOW,
  SHOW_LINK_CREATION_WINDOW,
  CLOSE_LINK_CREATION_WINDOW,
  SHOW_NODE_EDIT_WINDOW,
  HIDE_NODE_EDIT_WINDOW,
  OPEN_PROFILE_MENU,
  CLOSE_PROFILE_MENU,
  SHOW_LINK_EDIT_WINDOW,
  HIDE_LINK_EDIT_WINDOW,
  SHOW_CLEAR_PATH_DIALOG,
  HIDE_ALL_OVERLAYS,
  OPEN_BOTTOMBAR_MENU,
  CLOSE_BOTTOMBAR_MENU,
} from './constants'
import {
  START_SEARCH,
} from 'containers/FixedPath/constants'

export function addProfileNode ({ userId, name, imageUrl }) {
  // This is also called when closing the profile node when it is root,
  // to set the lineage tool to 'The Brane'
  return {
    type: START_SEARCH,
    payload: {
      _id: userId,
      isUserNode: true,
      name,
      imageUrl: imageUrl,
      children: [],
    },
  }
}

export function showNodeCreationWindow (parentId, title) {
  return {
    type: SHOW_NODE_CREATION_WINDOW,
    payload: {
      parentId,
      title,
    },
  }
}

export function closeNodeCreationWindow () {
  return { type: CLOSE_NODE_CREATION_WINDOW }
}

export function showLinkCreationWindow (parentLink, childLink, replace) {
  return {
    type: SHOW_LINK_CREATION_WINDOW,
    payload: {
      parentLink,
      childLink,
      replace,
    },
  }
}

export function closeLinkCreationWindow () {
  return {
    type: CLOSE_LINK_CREATION_WINDOW,
  }
}

export function showNodeEditWindow (nodeId) {
  return {
    type: SHOW_NODE_EDIT_WINDOW,
    payload: {
      nodeId,
    },
  }
}

export function hideNodeEditWindow () {
  return {
    type: HIDE_NODE_EDIT_WINDOW,
  }
}

export function openSidebarMenu (menu) {
  return { type: OPEN_SIDEBAR_MENU, menu }
}

export function closeSidebarMenu (menu) {
  return { type: CLOSE_SIDEBAR_MENU }
}

export function openBottombarMenu (menu) {
  return { type: OPEN_BOTTOMBAR_MENU, menu }
}

export function closeBottombarMenu () {
  return { type: CLOSE_BOTTOMBAR_MENU }
}

export function openProfileMenu () {
  return { type: OPEN_PROFILE_MENU }
}

export function closeProfileMenu () {
  return { type: CLOSE_PROFILE_MENU }
}

export function showLinkEditWindow (parentId, childId) {
  return {
    type: SHOW_LINK_EDIT_WINDOW,
    payload: {
      parentId,
      childId,
    },
  }
}

export function hideLinkEditWindow () {
  return {
    type: HIDE_LINK_EDIT_WINDOW,
  }
}

export function showClearPathDialog (show) {
  return {
    type: SHOW_CLEAR_PATH_DIALOG,
    payload: show,
  }
}

export function hideAllOverlays () {
  return {
    type: HIDE_ALL_OVERLAYS,
  }
}
