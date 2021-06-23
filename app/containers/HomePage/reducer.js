import {
  CLOSE_SIDEBAR_MENU,
  OPEN_SIDEBAR_MENU,
  SHOW_NODE_CREATION_WINDOW,
  CLOSE_NODE_CREATION_WINDOW,
  PUSH_PREVIEW_HISTORY,
  CLEAN_PREVIEW_HISTORY,
  SHOW_NODE_EDIT_WINDOW,
  HIDE_NODE_EDIT_WINDOW,
  OPEN_PROFILE_MENU,
  CLOSE_PROFILE_MENU,
  SHOW_LINK_EDIT_WINDOW,
  HIDE_LINK_EDIT_WINDOW,
  SHOW_LINK_CREATION_WINDOW,
  CLOSE_LINK_CREATION_WINDOW,
  SHOW_CLEAR_PATH_DIALOG,
  HIDE_WELCOME,
  HIDE_ALL_OVERLAYS,
  OPEN_BOTTOMBAR_MENU,
  CLOSE_BOTTOMBAR_MENU,
} from './constants'
import {
  START_SEARCH,
} from '../../containers/FixedPath/constants'
import sagas from './sagas'
import { injectReducer, injectSaga } from 'redux-injectors'

const initialState = {
  showProfileMenu: false,
  showClearPathDialog: false,
  nodeCreationWindow: {
    visible: false,
    parentId: null,
    title: '',
  },
  linkCreationWindow: {
    visible: false,
    parentLink: null,
    childLink: null,
  },
  nodeEditWindow: {
    show: false,
    nodeId: null,
  },
  linkEditWindow: {
    show: false,
    parentId: null,
    childId: null,
  },
  sideBarMenu: undefined,
  previewWindowHistory: [],
  previewWindowHistoryIndex: 0,
  welcome: true,
}

export const _initialState = initialState

function appReducer (state = initialState, action) {
  switch (action.type) {
    case START_SEARCH:
      return {
        ...state,
        sideBarMenu: undefined,
      }
    case OPEN_SIDEBAR_MENU:
      return {
        ...state,
        sideBarMenu: action.menu,
      }
    case CLOSE_SIDEBAR_MENU:
      return {
        ...state,
        sideBarMenu: undefined,
      }
    case OPEN_BOTTOMBAR_MENU:
      return {
        ...state,
        bottomBarMenu: action.menu,
      }
    case CLOSE_BOTTOMBAR_MENU:
      return {
        ...state,
        bottomBarMenu: undefined,
      }
    case SHOW_NODE_CREATION_WINDOW:
      return {
        ...state,
        nodeCreationWindow: {
          visible: true,
          parentId: action.payload.parentId,
          title: action.payload.title,
        },
        linkCreationWindow: {
          visible: false,
        },
        sideBarMenu: undefined,
      }
    case CLOSE_NODE_CREATION_WINDOW:
      return {
        ...state,
        nodeCreationWindow: {
          visible: false,
          parentId: null,
          title: '',
        },
      }
    case SHOW_LINK_CREATION_WINDOW:
      return {
        ...state,
        nodeCreationWindow: {
          visible: false,
        },
        linkCreationWindow: {
          visible: true,
          parentLink: action.payload.parentLink,
          childLink: action.payload.childLink,
          replace: action.payload.replace,
        },
      }
    case CLOSE_LINK_CREATION_WINDOW:
      return {
        ...state,
        linkCreationWindow: {
          visible: false,
          parentLink: null,
          childLink: null,
        },
      }
    case SHOW_NODE_EDIT_WINDOW:
      return {
        ...state,
        nodeEditWindow: {
          show: true,
          nodeId: action.payload.nodeId,
        },
      }
    case HIDE_NODE_EDIT_WINDOW:
      return {
        ...state,
        nodeEditWindow: {
          show: false,
          nodeId: null,
        },
      }
    case SHOW_LINK_EDIT_WINDOW:
      return {
        ...state,
        linkEditWindow: {
          show: true,
          parentId: action.payload.parentId,
          childId: action.payload.childId,
        },
      }
    case HIDE_LINK_EDIT_WINDOW:
      return {
        ...state,
        linkEditWindow: {
          show: false,
          parentId: null,
          childId: null,
        },
      }
    case PUSH_PREVIEW_HISTORY:
      const { payload } = action
      const { previewWindowHistory } = state
      let newHistory = [...previewWindowHistory]
      if (payload.startId) {
        if (!previewWindowHistory.find(item => ((item.startId === payload.startId) && (item.stopId === payload.stopId)))) {
          newHistory.push(payload)
        }
      } else if (!previewWindowHistory.find(item => item.id === payload.id)) {
        newHistory.push(payload)
      }
      let currentIndex = 0
      if (payload.startId) {
        currentIndex = newHistory.findIndex(item => ((item.startId === payload.startId) && (item.stopId === payload.stopId)))
      } else {
        currentIndex = newHistory.findIndex(item => item.id === payload.id)
      }
      return {
        ...state,
        previewWindowHistory: newHistory,
        previewWindowHistoryIndex: currentIndex !== -1 ? currentIndex : 0,
      }
    case CLEAN_PREVIEW_HISTORY:
      return {
        ...state,
        previewWindowHistory: [],
        previewWindowHistoryIndex: 0,
      }
    case OPEN_PROFILE_MENU:
      return {
        ...state,
        showProfileMenu: true,
      }
    case CLOSE_PROFILE_MENU:
      return {
        ...state,
        showProfileMenu: false,
      }
    case SHOW_CLEAR_PATH_DIALOG:
      return {
        ...state,
        showClearPathDialog: action.payload,
      }
    case HIDE_WELCOME:
      return {
        ...state,
        welcome: false,
      }
    case HIDE_ALL_OVERLAYS:
      return {
        ...initialState,
        welcome: state.welcome,
        previewWindowHistory: state.previewWindowHistory,
        previewWindowHistoryIndex: state.previewWindowHistoryIndex,
        submittedQuery: state.submittedQuery,
      }
    default:
      return state
  }
}

export default appReducer

export const composeHomeReducer = [
  injectReducer({ key: 'home', reducer: appReducer }),
  injectSaga({ key: 'home', saga: sagas }),
]
