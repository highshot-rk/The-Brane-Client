import {
  SHOW,
  HIDE,
  LOAD_SUCCESS,
} from './constants'

import { fromJS } from 'immutable'
import { SHOW_LINK_EDIT_WINDOW } from '../HomePage/constants'
import { injectReducer, injectSaga } from 'redux-injectors'
import saga from './sagas'

const initialState = fromJS({
  show: false,
  startId: null,
  stopId: null,
  startNode: null,
  stopNode: null,
  linkDetails: null,
  img: null,
  fromSideBar: false,
})

function NodePreviewWindowReducer (state = initialState, { type, payload }) {
  switch (type) {
    case SHOW:
      return state
        .set('show', true)
        .set('startId', payload.startId)
        .set('stopId', payload.stopId)
        .set('fromSideBar', payload.fromSideBar)
        .set('startNode', null)
        .set('stopNode', null)
        .set('linkDetails', null)
        .set('img', null)
    case LOAD_SUCCESS:
      return state
        .set('startNode', payload.startNode)
        .set('stopNode', payload.stopNode)
        .set('linkDetails', payload.linkDetails)
        .set('img', payload.uploads[0] ? payload.uploads[0].url : null)

    // falls through
    case SHOW_LINK_EDIT_WINDOW:
    case HIDE:
      return state
        .set('show', false)
    default:
      return state
  }
}

export default NodePreviewWindowReducer

export const composeLinkContentWindowReducer = [
  injectReducer({ key: 'linkPreviewWindow', reducer: NodePreviewWindowReducer }),
  injectSaga({ key: 'linkPreviewWindow', saga }),
]
