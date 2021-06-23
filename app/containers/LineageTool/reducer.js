/*
 *
 * LineageTool reducer
 *
 */

import { fromJS } from 'immutable'
import {
  ADD_NODE,
  FOCUS_NODE,
  NEW_SEARCH_CONFIRMED,
  RESTORE_PATH,
  ADD_RELATED,
  SET_PATH_ID,
  RESTORE_SAVED_PATH,
} from 'containers/FixedPath/constants'
import {
  CONFIRM_RESTORE_PATH,
  CANCEL_RESTORE_PATH,
  FOCUS_PATH_WINDOW,
} from './constants'
import {
  BRANE_NODE_ID, VENN_ID, ROOT_NODE_TITLE,
} from '../../constants'
import { injectReducer } from 'redux-injectors'

// TODO: look into reusing activePath from the fixed path reducer
// instead of storing it here also
const initialState = fromJS({
  confirmRestorePath: null,
  activePathIndex: 0,
  pathWindowFocused: false,
  paths: [
    {
      id: 0,
      history: [{
        id: BRANE_NODE_ID,
        type: 'root',
        title: ROOT_NODE_TITLE,
        active: true,
      }],
    },
  ],
})

function deactivatePath (path) {
  return path.update('history', historyItems =>
    historyItems.map(historyItem => historyItem.set('active', false))
  )
}

function deactivateAll (state) {
  return state.update('paths', (paths) => {
    return paths.map(path => {
      return deactivatePath(path)
    })
  })
}

function lineageToolReducer (state = initialState, { type, payload }) {
  switch (type) {
    case ADD_NODE:
      return deactivateAll(state)
        .updateIn(
          ['paths', state.get('activePathIndex'), 'history'],
          history => {
            return history.push(
              fromJS({
                id: payload.id,
                title: payload.title,
                active: true,
                type: 'simple',
              })
            )
          })
    case FOCUS_NODE:
      return deactivateAll(state).updateIn(
        ['paths', state.get('activePathIndex'), 'history'],
        history => history.map(historyItem => {
          if (historyItem.get('id') === payload.id) {
            return historyItem.set('active', true)
          }

          return historyItem
        }
        ))
    case NEW_SEARCH_CONFIRMED:
      let activePathIndex = state.get('activePathIndex') + 1
      return deactivateAll(state)
        .set('activePathIndex', activePathIndex)
        .update('paths', paths => {
          return paths.push(fromJS({
            id: activePathIndex,
            history: [{
              id: payload._id,
              title: payload.title,
              active: true,
              type: payload.type || 'search',
            }],
          }))
        })
    case CONFIRM_RESTORE_PATH:
      return state.set('confirmRestorePath', { pathIndex: payload.pathIndex, nodeId: payload.nodeId })
    case CANCEL_RESTORE_PATH:
      return state.set('confirmRestorePath', null)
    case RESTORE_PATH:
      const pathIndex = state.get('paths').findIndex(path => path.get('id') === payload.pathId)
      return deactivateAll(state)
        .set('activePathIndex', pathIndex)
        .set('confirmRestorePath', null)
        // Temporarily set one item to active
        .updateIn(['paths', pathIndex, 'history', 0], history => history.set('active', true))
    // Update the history type when the history item is a cluster node
    case ADD_RELATED:
      return state.update('paths', (paths) => {
        return paths.map(path => {
          return path.update('history', history => {
            return history.map(historyItem => {
              if (historyItem.get('id') === payload.parentId && payload.isCluster) {
                return historyItem.set('type', 'cluster')
              }
              return historyItem
            })
          })
        })
      })
    case SET_PATH_ID:
      return state.setIn(['paths', state.get('activePathIndex'), 'id'], payload.pathId)
    case FOCUS_PATH_WINDOW:
      return state.set('pathWindowFocused', payload)
    case RESTORE_SAVED_PATH:
      const { path: { nodes, focusedNode }, pathId } = payload
      state = deactivateAll(state)
      state = state.update('paths', paths => {
        return paths.push(fromJS({
          id: pathId,
          history: [],
        }))
      })
      const pathIdIndex = state.get('paths').findIndex(path => path.get('id') === pathId)
      Object.values(nodes).map(savedNode => {
        state = state.updateIn(
          ['paths', pathIdIndex, 'history'],
          history => {
            return history.push(
              fromJS({
                id: savedNode._id,
                name: savedNode.name,
                active: focusedNode === savedNode._id,
                type: savedNode._id === '0' ? 'root' : savedNode._id === VENN_ID ? 'search' : 'simple',
              })
            )
          })
      })
      return state.set('activePathIndex', pathIdIndex)
    default:
      return state
  }
}

export default lineageToolReducer

export const composeLineageReducer = [
  injectReducer({ key: 'lineageTool', reducer: lineageToolReducer }),
]
