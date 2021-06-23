/* globals localStorage */
import {
  ADD_LINK,
  ADD_NODE,
  ADD_RELATED,
  ADD_REORDERED_CHILD,
  ANIMATE_BRANCH_COLLAPSE,
  COLLAPSE_BRANCH,
  EXPAND_BRANCH,
  FOCUS_NODE,
  HIDE_BRANCH_PIPELINE,
  HIDE_MENU,
  HIDE_SINGLE_NODE_VIEW,
  HISTORY_NEXT,
  HISTORY_PREV,
  NEW_SEARCH,
  NEW_SEARCH_CONFIRMED,
  NEW_SEARCH_CANCELED,
  SHOW_BRANCH_PIPELINE,
  SHOW_MENU,
  SHOW_SINGLE_NODE_VIEW,
  OPEN_MENU_FOR,
  SINGLE_NODE_VIEW_READY,
  TOGGLE_ORBIT_LOCK,
  TOGGLE_CLUSTER_STATE,
  ZOOM_IN,
  ZOOM_OUT,
  CENTER_ON_FOCUSED,
  OPEN_LINK_PREVIEW_WINDOW_FOR,
  RESTORE_PATH,
  SET_PATH_ID,
  RESTORE_SAVED_PATH,
  FOCUS_CHILD,
  TOGGLE_ALL_ORBITS,
  TOGGLE_MINI_CLUSTERS,
  SELECT_MINI_CLUSTER,
  CHILDREN_LOADING,
  CHILDREN_PRE_LOADED,
  SAVE_PROGRESS,
} from './constants'

import { fromJS } from 'immutable'
import { getData } from '../../utils/injectData'
import { nodeOriginallyFrom } from './layout.ts'
import { HIDE_ALL_OVERLAYS } from '../HomePage/constants'
import {
  BRANE_NODE_ID, INITIAL_PATH_ID, VENN_ID,
} from '../../constants'
import { createRelative, createNode } from 'utils/factories'
import sagas from './sagas'
import { injectReducer, injectSaga } from 'redux-injectors'

let expandIndex = 0
let animationDataId = 0
let activePathId = INITIAL_PATH_ID

const RESTORE_STATE_ON_RELOAD = false

let initialState = fromJS({
  oldPaths: {},
  activePath: activePathId,
  miniClusters: false,
  expandedMiniClusters: {},
  singleNodeView: {
    _id: '0',
    show: false,
    prepared: false,
  },
  menu: null,
  openMenuFor: null,
  unconfirmedSearch: null,
  branchPipeline: {
    id: '0',
    show: false,
  },
  nodes: {
    [BRANE_NODE_ID]: {
      // avoid crashing here when the data failed to be injected
      // so we can render the app component and show a better
      // error message
      ...createNode(getData('root-node').rootNode || { _id: 'none-existant' }),
      from: {},
      vennIds: [],
    },
  },
  relatives: {
    [BRANE_NODE_ID]: (getData('root-node').links || []).reduce((result, { _to, ...link }) => {
      result[_to._id] = createRelative(_to, link)
      return result
    }, {}),
  },
  reorderedRelatives: {},
  history: [BRANE_NODE_ID],
  historyIndex: 0,
  zoomValue: 1,
  openLPWfor: null,
  prevZoomValue: 1,
  centerOnFocused: null,
  focusedNode: BRANE_NODE_ID,
  animationData: {
    nodes: fromJS({}),
    id: -1,
  },
  focusChild: null,
  allOrbitsLocked: false,
  progress: 0,
  loadingRelativesFor: null,
  // Work around for immutable.js blocking up to a few seconds
  // when converting api responses into immutable objects
  // Can be removed once we no longer use immutable.js
  preLoaded: false,
})
export const _initialState = initialState

let prevState = {}

// This can be used during development.
// Change this constant to true,
// then once you have created the layout run
// saveFPState() in the console.
// TODO: the index and ids (expand, animation, active path) above should also be saved and restored
if (RESTORE_STATE_ON_RELOAD) {
  if (localStorage.getItem('_fixedPathState')) {
    initialState = fromJS(JSON.parse(localStorage.getItem('_fixedPathState')))
  }

  window.saveFPState = function () {
    console.dir(prevState.toJS())
    localStorage.setItem('_fixedPathState', JSON.stringify(prevState.toJS()))
  }
}

export default function fixedPathReducer (state = initialState, { type, payload }) {
  if (RESTORE_STATE_ON_RELOAD) {
    prevState = state
  }

  switch (type) {
    case FOCUS_CHILD:
      return state.set('focusChild', payload)
    case SHOW_MENU:
      return state.set('menu', {
        // When a link menu, node is a string with the destination id
        node: typeof payload.node === 'object' ? {
          _id: payload.node._id,
          title: payload.node.title,
          // angle stores radius when menu is open for parent
          angle: payload.angleOrRadius,
        } : payload.node,
        x: payload.x,
        y: payload.y,
        isChild: payload.isChild,
        parentId: payload.parentId,
      }).set('openMenuFor', null)

    case HIDE_MENU:
      return state.set('menu', null)
    case SAVE_PROGRESS:
      return state.set('progress', payload)

    case OPEN_MENU_FOR:
      return state.set('openMenuFor', payload.childId)

    case NEW_SEARCH:
      return state.set('unconfirmedSearch', payload)

    case NEW_SEARCH_CANCELED:
      return state.set('unconfirmedSearch', null)

    case NEW_SEARCH_CONFIRMED:
      const currentPathId = state.get('activePath')

      return state.setIn(['oldPaths', currentPathId, 'nodes'], state.get('nodes'))
        .setIn(['oldPaths', currentPathId, 'relatives'], state.get('relatives'))
        .setIn(['oldPaths', currentPathId, 'focusedNode'], state.get('focusedNode'))
        .setIn(['oldPaths', currentPathId, 'history'], state.get('history'))
        .update('activePath', () => ++activePathId)
        .set('nodes', fromJS({
          [payload._id]: {
            _id: payload._id,
            isUserNode: payload.isUserNode || payload.group === 'Premium user',
            title: payload.title,
            // TODO currently the database schema does not have an imageUrl
            // column, using the title4 space for now.
            // imageUrl only works with the Dropup component
            imageUrl: payload.imageUrl || payload.title4 || null,
            from: fromJS({}),
            invertCluster: false,
            vennIds: payload.vennIds || [],
          },
        }))
        .set('relatives', fromJS({
          [payload._id]: payload.relatives.reduce((result, child) => {
            result[child._id] = {
              _id: child._id,
              title: child.title,
              count: child.count,
              linkType: child.linkType,
              linkName: child.linkName,
              linkDirection: 'child',
            }

            return result
          }, {}),
        }))
        .set('history', fromJS([payload._id]))
        .set('historyIndex', 0)
        .setIn(['singleNodeView', 'show'], false)
        .set('focusedNode', payload._id)
        .set('unconfirmedSearch', null)
        .set('menu', null)

    case ADD_RELATED:
      state = state
        .set('loadingRelativesFor', null)
        .set('preLoaded', false)
        .updateIn(
          ['relatives', payload.parentId],
          (relatives) => {
            const newRelatives = fromJS(
              payload.relatives.reduce((result, child) => {
                result[child._id] = {
                  _id: child._id,
                  _type: child._type,
                  title: child.title,
                  childCount: child.childCount,
                  parentCount: child.parentCount,
                  tagList: child.tagList,
                  linkType: child.linkType,
                  linkName: child.linkName,
                  linkDirection: child.linkDirection,
                }

                return result
              }, {})
            )

            if (relatives) {
              return relatives.mergeDeep(newRelatives)
            }

            return newRelatives
          })
      if (payload.nodesToDelete) {
        const deleteItem = key => {
          return state.deleteIn(['relatives', payload.parentId, key])
        }
        payload.nodesToDelete.forEach(toDeleteKey => {
          state = deleteItem(toDeleteKey)
        })
      }
      if (payload.parentId !== VENN_ID) {
        state = state.updateIn(['nodes', payload.parentId], node => {
          node = node ? node.toJS() : {
            _id: payload.parentId,
          }
          if (payload.nodeTagList) {
            node.tagList = payload.nodeTagList
          }
          node._type = payload._type
          node.title = payload.nodeTitle
          return fromJS(node)
        })
      }
      return state

    case ADD_NODE:
      let tagList = []

      return state.updateIn(
        ['relatives', payload.sourceId, payload.id],
        (child) => {
          child = child ? child.toJS() : {
            _id: payload.id,
            title: payload.title,
          }

          tagList = child.tagList || []

          child.expanded = expandIndex++
          child.collapsed = false

          return fromJS(child)
        }
      )
        .updateIn(['relatives', payload.id], relatives => relatives || fromJS({}))
        .setIn(
          ['nodes', payload.id],
          fromJS({
            _id: payload.id,
            _type: payload._type,
            title: payload.title,
            invertCluster: false,
            orbitLocked: state.get('allOrbitsLocked'),
            vennIds: [],
            tagList,
            from: fromJS({
              [payload.sourceId]: {
                angle: payload.angle,
                isParent: payload.isParent || false,
              },
            }),
          })
        )
        .update('history', (history) => history.push(payload.id))
        .update('historyIndex', (historyIndex) => historyIndex + 1)
        .set('menu', null)
        .setIn(['singleNodeView', 'show'], false)
        .set('focusedNode', payload.id)

    case ADD_LINK:
      return state.setIn(
        ['relatives', payload.from, payload.to, 'expanded'],
        expandIndex++
      )
        .setIn(
          ['relatives', payload.from, payload.to, 'gateway'],
          true
        )
        .setIn(
          ['nodes', payload.to, 'from', payload.from],
          fromJS({
            angle: 0,
            gateway: true,
            title: payload.nodeTitle,
          })
        )
        .set('focusedNode', payload.to)
        .set('menu', null)
        .setIn(['singleNodeList', 'show'], false)

    case ADD_REORDERED_CHILD:
      return state.updateIn(['reorderedRelatives', payload.parentId], (relatives = []) => {
        return [...relatives, {
          _id: payload.childId,
          index: payload.index,
          side: payload.side,
        }]
      })

    case COLLAPSE_BRANCH:
      return state
        .set('focusedNode', payload.sourceNode)
        .setIn(['nodes', payload.id, 'collapsed'], true)
        .set('menu', null)
        .setIn(['singleNodeView', 'show'], false)
        .setIn(['singleNodeView', 'prepared'], false)

    case EXPAND_BRANCH:
      let origionallyFrom = nodeOriginallyFrom(state.getIn(['nodes', payload.id]).toJS())

      return state.set('focusedNode', payload.id)
        .set('menu', null)
        .setIn(['nodes', payload.id, 'collapsed'], false)
        .setIn(['branchPipeline', 'show'], false)
        .setIn(['singleNodeView', 'show'], false)
        .setIn(['singleNodeView', 'prepared'], false)
        .setIn(
          [
            'relatives',
            origionallyFrom,
            payload.id,
            'expanded',
          ],
          expandIndex++
        )
        .updateIn(
          [
            'nodes',
            payload.id,
            'from',
            origionallyFrom,
          ],
          (from) => {
            if (!from) {
              return from
            }

            return from.set(
              'angle',
              payload.angle ? payload.angle : from.get('angle')
            )
          }
        )
        .setIn(['animationData', 'id'], animationDataId++)
        .setIn(['animationData', 'nodes'], fromJS({}))

    case TOGGLE_ORBIT_LOCK:
      return state.setIn(
        ['nodes', payload.id, 'orbitLocked'],
        !state.getIn(['nodes', payload.id, 'orbitLocked'])
      )

    case TOGGLE_ALL_ORBITS:
      const allOrbitsLocked = state.get('allOrbitsLocked')
      state.get('nodes').keySeq().forEach(nodeId => {
        state = state.setIn(
          ['nodes', nodeId, 'orbitLocked'],
          !allOrbitsLocked
        )
      })
      return state.set('allOrbitsLocked', !allOrbitsLocked)

    case FOCUS_NODE:
      return state.set('menu', null)
        .setIn(['singleNodeView', 'show'], false)
        .set('focusedNode', payload.id)
    case HISTORY_PREV:
      const newState = state.update('historyIndex', (historyIndex) => historyIndex - 1 < 0 ? 0 : historyIndex - 1)
      return newState.set(
        'focusedNode',
        newState.get('history').get(newState.get('historyIndex'))
      )

    case HISTORY_NEXT: {
      const historyLength = state.get('history').size
      const newState = state.update('historyIndex', (historyIndex) => historyIndex + 1 > historyLength - 1 ? historyLength - 1 : historyIndex + 1)
      return newState.set(
        'focusedNode',
        newState.get('history').get(newState.get('historyIndex'))
      )
    }

    case SHOW_BRANCH_PIPELINE:
      return state.set('menu', null)
        .setIn(['branchPipeline', 'show'], true)
        .setIn(['branchPipeline', 'id'], payload.id)

    case HIDE_BRANCH_PIPELINE:
      state = state.setIn(['branchPipeline', 'show'], false)
      if (payload.focusId) {
        payload.expandNodes.forEach(nodeId => {
          state = state.setIn(['nodes', nodeId, 'collapsed'], false)
            .setIn(
              [
                'relatives',
                nodeOriginallyFrom(state.getIn(['nodes', nodeId]).toJS()),
                nodeId,
                'expanded',
              ],
              expandIndex++
            )
        })

        payload.collapseNodes.forEach(nodeId => {
          state = state.setIn(['nodes', nodeId, 'collapsed'], true)
        })
        state = state.set('focusedNode', payload.focusId)
      }

      if (payload.animationData && payload.animationData.length > 0) {
        // clear old animation data
        state = state.setIn(['animationData', 'nodes'], fromJS({}))

        payload.animationData.forEach(data => {
          state = state.setIn(['animationData', 'nodes', data._id], {
            delay: data.delay,
            type: data.type,
          })
        })
        state = state.setIn(['animationData', 'id'], animationDataId++)
        state = state.setIn(['animationData', 'follow'], state.getIn(['animationData', 'id']))
      }

      return state

    case ANIMATE_BRANCH_COLLAPSE:
      // clear old animation data
      state = state.setIn(['animationData', 'nodes'], fromJS({}))
        .set('menu', null)

      payload.animationData.forEach(data => {
        state = state.setIn(['animationData', 'nodes', data._id], {
          delay: data.delay,
          type: data.type,
        })
      })

      return state.setIn(['animationData', 'id'], animationDataId++)

    case SHOW_SINGLE_NODE_VIEW:
      state = state.setIn(['singleNodeView', 'show'], true)
        .setIn(['singleNodeView', '_id'], payload._id)
        .setIn(['singleNodeView', 'prepared'], false)
        .set('focusedNode', payload._id)
        .set('prevZoomValue', state.toJS().zoomValue)
        .set('zoomValue', 1)
        .setIn(['animationData', 'nodes'], fromJS({}))

      payload.animationData.forEach((data) => {
        state = state.setIn(['animationData', 'nodes', data._id], {
          delay: data.delay,
          type: data.type,
        })
      })

      return state.setIn(['animationData', 'id'], animationDataId++)

    case SINGLE_NODE_VIEW_READY:
      return state.setIn(['singleNodeView', 'prepared'], true)
        .updateIn(['animationData', 'nodes'], (_nodes) => {
          const nodes = _nodes.toJS()
          return Object.keys(nodes).reduce((result, _id) => {
            result[_id] = {
              ...nodes[_id],
              type: 'show',
            }

            return result
          }, {})
        })
        .setIn(['animationData', 'id'], animationDataId++)

    case HIDE_SINGLE_NODE_VIEW:
      return state.setIn(['singleNodeView', 'show'], false)
        .setIn(['singleNodeView', 'prepared'], false)
        .setIn(['animationData', 'id'], animationDataId++)
        .setIn(['branchPipeline', 'show'], false)
        .set('zoomValue', state.toJS().prevZoomValue)
        .set('prevZoomValue', 1)
        .set('menu', null)

    case TOGGLE_CLUSTER_STATE:
      return state.updateIn(['nodes', payload._id, 'invertCluster'], inverted => !inverted)
    case SELECT_MINI_CLUSTER:
      return state.setIn(['expandedMiniClusters', payload.nodeId], payload.clusterId)

    case ZOOM_IN:
      return state.update('zoomValue', current => (current < 1 ? (current * 100 + 10) / 100 : 1))

    case ZOOM_OUT:
      return state.update('zoomValue', current => (current > 0.1 ? (current * 100 - 10) / 100 : 0.1))

    case CENTER_ON_FOCUSED:
      return state.set('centerOnFocused', Date.now())

    case OPEN_LINK_PREVIEW_WINDOW_FOR:
      return state.set('openLPWfor', payload)

    case RESTORE_PATH: {
      const activePath = state.get('activePath')

      return state
        .setIn(['oldPaths', activePath, 'nodes'], state.get('nodes'))
        .setIn(['oldPaths', activePath, 'relatives'], state.get('relatives'))
        .setIn(['oldPaths', activePath, 'focusedNode'], state.get('focusedNode'))
        .setIn(['oldPaths', activePath, 'history'], state.get('history'))
        .set('nodes', state.getIn(['oldPaths', payload.pathId, 'nodes']))
        .set('relatives', state.getIn(['oldPaths', payload.pathId, 'relatives']))
        .set('focusedNode', state.getIn(['oldPaths', payload.pathId, 'focusedNode']))
        .set('history', state.getIn(['oldPaths', payload.pathId, 'history']))
        .set('activePath', payload.pathId)
    }

    case SET_PATH_ID:
      return state.set('activePath', payload.pathId)

    case RESTORE_SAVED_PATH: {
      expandIndex = payload.maxExpandIndex > expandIndex ? payload.maxExpandIndex : expandIndex
      let activePath = state.get('activePath')

      return state.setIn(['oldPaths', activePath, 'nodes'], state.get('nodes'))
        .setIn(['oldPaths', activePath, 'relatives'], state.get('relatives'))
        .setIn(['oldPaths', activePath, 'focusedNode'], state.get('focusedNode'))
        .setIn(['oldPaths', activePath, 'history'], state.get('histroy'))
        .set('activePath', payload.pathId)
        .set('nodes', fromJS(payload.path.nodes))
        .set('relatives', fromJS(payload.path.relatives))
        .set('focusedNode', payload.path.focusedNode)
        .set('history', payload.path.history || [])
    }

    case HIDE_ALL_OVERLAYS:
      return state.set('menu', null)
        .set('openMenuFor', null)
        .set('unconfirmedSearch', null)
        .setIn(['branchPipeline', 'show'], false)

    case TOGGLE_MINI_CLUSTERS:
      return state.update('miniClusters', enabled => !enabled)
        .set('expandedMiniClusters', fromJS({}))

    case CHILDREN_LOADING:
      // TODO: this should be a property on each node so we can track
      // loading status separately when multiple are loading
      return state
        .set('loadingRelativesFor', payload.nodeId)
        .set('preLoaded', true)

    case CHILDREN_PRE_LOADED:
      return state.set('preLoaded', payload.loaded)

    default:
      return state
  }
}

export const composeFixedPathReducer = [
  injectReducer({ key: 'fixedPath', reducer: fixedPathReducer }),
  injectSaga({ key: 'fixedPath', saga: sagas }),
]
