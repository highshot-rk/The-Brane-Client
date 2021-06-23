import {
  LOAD_SUCCESS,
  LOAD_FAILED,
  SHOW,
  HIDE,
  EXPAND_ACTIVE,
  TOGGLE_LINK_SIDEBAR,
  HIDE_NODE_CREATION_DETAILS,
  LOAD_IMAGE,
  RELATIVES_LOADED,
} from './constants'
import {
  SHOW_NODE_EDIT_WINDOW,
} from 'containers/HomePage/constants'
import { createNode } from 'utils/factories'
import { injectReducer, injectSaga } from 'redux-injectors'
import saga from './sagas'

const initialState = {
  show: false,
  name: null,
  loading: false,
  expandActive: false,
  showLinkSidebar: false,
  node: createNode({ _id: 'none', title: 'Loading...' }),
  numbers: {
    visites: 0,
    followers: 0,
    experts: 0,
  },
  relatives: [],
  image: {
    url: null,
    imgDescription: 'No Image Description',
  },
  creationDetails: {
    justCreated: true,
    initialParentId: null,
    iniitalParentTitle: '',
  },
}

function NodePreviewWindowReducer (state = initialState, action) {
  switch (action.type) {
    case SHOW:
      return {
        ...state,
        creationDetails: action.payload.creationDetails,
        show: true,
        loading: true,
      }

    // falls through to HIDE
    case SHOW_NODE_EDIT_WINDOW:
    case HIDE:
      return {
        ...initialState,
      }
    case LOAD_SUCCESS:
      const node = action.payload.node
      return {
        ...state,
        node: {
          ...state.node,
          ...node,
        },
        loading: false,
      }
    case LOAD_FAILED:
      return {
        ...state,
        loading: false,
        response: action.response,
      }
    case LOAD_IMAGE:
      return {
        ...state,
        image: {
          url: action.payload.url,
          description: action.payload.description,
        },
      }
    case RELATIVES_LOADED:
      return {
        ...state,
        // relatives should be in the format from the createRelative factory
        relatives: action.payload,
      }
    case EXPAND_ACTIVE:
      return {
        ...state,
        expandActive: !state.expandActive,
      }
    case TOGGLE_LINK_SIDEBAR:
      return {
        ...state,
        showLinkSidebar: !state.showLinkSidebar,
      }
    case HIDE_NODE_CREATION_DETAILS:
      return {
        ...state,
        creationDetails: {
          ...state.creationDetails,
          justCreated: false,
        },
      }
    default:
      return state
  }
}

export default NodePreviewWindowReducer

export const composeNodeContentWindowReducer = [
  injectReducer({ key: 'nodePreviewWindow', reducer: NodePreviewWindowReducer }),
  injectSaga({ key: 'nodePreviewWindow', saga }),
]
