/* eslint-disable semi */
import {
  ADD_NODE,
  ADD_RELATED,
  NEW_SEARCH,
  NEW_SEARCH_CONFIRMED,
  START_SEARCH,
  OPEN_LINK_PREVIEW_WINDOW_FOR,
  UPDATE_NODES,
  HIDE_MENU,
  ADD_REORDERED_CHILD,
  SHOW_SINGLE_NODE_VIEW,
  TOGGLE_ORBIT_LOCK,
  EXPAND_BRANCH,
  COLLAPSE_BRANCH,
  ADD_LINK,
  FOCUS_NODE,
  SET_PATH_ID,
  HIDE_BRANCH_PIPELINE,
  HISTORY_NEXT,
  HISTORY_PREV,
  EXPORT_TOPICS,
} from './constants'
import { addNode, focusNode, hideMenu, expandBranch, childrenPreLoaded, childrenLoading } from './actions'
import { hide } from '../NodePreviewWindow/actions'
import {
  call,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
  all,
  delay,
  fork,
  join,
  race,
} from 'redux-saga/effects';
import {
  getNode,
  getRelatives,
  getRelatedProperties,
  getVennResults,
} from 'api/node';
import { createPath, updatePath } from 'api/path';
import { BRANE_NODE_ID, VENN_ID } from '../../constants';

import {
  CLEAN_PREVIEW_HISTORY,
  OPEN_PROFILE_MENU,
} from '../HomePage/constants';
import { confirmRestorePath } from '../LineageTool/actions';
import { findInPaths, childrenOnOrbit } from 'utils/fixed-path';
import { featureEnabled } from 'utils/features';
import {
  generateCSV,
  download,
} from 'utils/export-downloadable';
import {
  clone, pickBy,
} from 'lodash-es'
import { pauseSubscribe, resumeSubscribe } from 'utils/redux';
import { createTagList } from 'utils/tags';
import { networkErrorPopup } from 'utils/network-error';
import { selectShowOnOrbit, selectTagFilters, selectFilterWithin } from 'containers/FilterMenu/selectors';
import { selectActiveProperties } from 'containers/PropertySidebar/selectors';
import { filterNodeObject } from 'utils/filterNodes'
import { filterShowOnOrbit } from '../../utils/filterNodes';

// Enable this to generate fake data for node's children
// Every node will have the same children, making it easier to
// work on many parts of the fixed path
const TEST_DATA = false;

export const CLUSTER_VERBS = ['contains', 'categorizes'];

function * testRelated (action) {
  yield delay(200);

  let length = 30;
  let results = [];

  for (let i = 0; i < length; i++) {
    if (`test-${i + 10}` !== action.payload.id) {
      results.push({
        _id: `test-${i + 10}`,
        name: `Node ${i}`,
      });
    }
  }
  return results;
}

function * loadRelated (action) {
  let results;
  let node;
  let relatives;
  let id = action.payload.id;
  let nodesToDelete = [];

  if (action.payload._id === VENN_ID) {
    return;
  }

  if (TEST_DATA) {
    results = yield testRelated(action);
  } else {
    try {
      const resultFork = yield fork(function * () {
        return yield all([
          call(getNode, id),
          call(getRelatives, id),
        ])
      })

      const { timeout } = yield race({
        finished: join(resultFork),
        timeout: delay(1000),
      })

      if (timeout) {
        pauseSubscribe();
        yield put(childrenLoading(id))
        yield put(childrenPreLoaded(true))
        resumeSubscribe();
      }

      results = yield join(resultFork);

      if (timeout) {
        // Converting results into immutable.js objects
        // blocks for a while, which causes the animation to stop.
        // This can be removed once we remove immutable.js in the fixed path
        // reducer
        yield put(childrenPreLoaded(false))
      }
    } catch (e) {
      return yield networkErrorPopup(e);
    }
    let currentRelatives = yield select((state) =>
      state.fixedPath.getIn(['relatives', id])
    );

    if (currentRelatives) {
      currentRelatives = currentRelatives.toJS();
    } else {
      // The node is no longer on the path, possibly from it being cleared or
      // a new search started
      return;
    }
    ([
      node,
      relatives,
    ] = results);

    Object.keys(currentRelatives).forEach((childKey) => {
      if (relatives.findIndex((result) => result._id === childKey) === -1) {
        nodesToDelete.push(childKey);
      }
    });
  }

  // Pause subscribers so react doesn't render after each dispatch
  yield put({
    type: ADD_RELATED,
    payload: {
      parentId: id,
      relatives,
      _type: node._type,
      nodeTitle: node.title,
      nodesToDelete,
      nodeTagList: createTagList(node, relatives.filter(relative => relative.linkDirection === 'parent')),
    },
  });
}

function * loadVennDiagramResults (action) {
  let results = [];

  try {
    results = yield call(getVennResults, action.payload.queryInfo);
  } catch (e) {
    console.log(e);
    return;
  }

  // TODO: the api should identify parents and children
  const relatives = results;

  yield put({
    type: ADD_RELATED,
    payload: { parentId: action.payload._id, relatives },
  });
}

function * searchLoadRelated (action) {
  if (action.payload.vennIds && action.payload.vennIds.length > 0) {
    yield loadVennDiagramResults(action);
  } else {
    yield loadRelated({
      payload: {
        id: action.payload._id,
      },
    });
  }
}

/**
 * This function recursively expand collapsed nodes
 * @param {object} nodes list of nodes
 * @param {string} id the initial id to expand
 */
function * expandCollapsed (nodes, id) {
  const fromId = Object.keys(nodes[id].from)[0];
  if (fromId && nodes[fromId].collapsed) {
    yield expandCollapsed(nodes, fromId);
  }
  yield put(expandBranch(id));
}

function * handleSearch ({ payload }) {
  const state = yield select((state) => state.fixedPath.toJS());
  const lineageTool = yield select((state) => state.lineageTool.toJS());
  const nodes = Object.keys(state.relatives);
  if (payload._id !== VENN_ID) {
    // Check if The Brane node
    if (payload._id === BRANE_NODE_ID && state.activePath !== 0) {
      yield put(confirmRestorePath(0, BRANE_NODE_ID));
      return;
    }
    let foundInPaths = findInPaths(lineageTool.paths, payload._id);

    if (foundInPaths.history) {
      const [activeInPath] = foundInPaths.history.filter(
        (historyItem) => historyItem.active
      );
      if (activeInPath) {
        yield put(focusNode(foundInPaths.id));
        return;
      } else {
        yield put(confirmRestorePath(foundInPaths.pathIndex, foundInPaths.id));
        return;
      }
    }

    // Check if already expanded
    if (payload._id in state.nodes && payload._id) {
      // Check if is collapsed
      if (state.nodes[payload._id].collapsed) {
        yield expandCollapsed(state.nodes, payload._id);
        return;
      }
      yield put(focusNode(payload._id));
      return;
    }

    // Check if a direct child
    for (let i = 0; i < nodes.length; i++) {
      if (payload._id in state.relatives[nodes[i]]) {
        // Check if the parent is collapsed
        if (state.nodes[nodes[i]].collapsed) {
          yield put(expandBranch(nodes[i]));
        }
        yield put(
          addNode(
            { id: payload._id, title: payload.title, _type: payload._type },
            nodes[i],
            0
          )
        );
        return;
      }
    }
  }

  // In some situations, there can be undefined keys in the relatives object
  const nodeCount = nodes.filter((node) => node !== 'undefined').length;
  // When the path only has one node, we do not need to confirm the search
  const actionType = nodeCount > 1 ? NEW_SEARCH : NEW_SEARCH_CONFIRMED;

  yield put({
    type: actionType,
    payload,
  });
}

function * handleUpdateNodes ({ payload }) {
  const nodesOnPath = yield select((state) =>
    state.fixedPath.get('nodes').keySeq().toArray()
  );
  const relatives = yield select((state) =>
    state.fixedPath.get('relatives').toJS()
  );
  const nodesToUpdate = payload.nodes.filter((node) =>
    nodesOnPath.includes(node)
  );

  Object.keys(relatives).forEach((node) => {
    Object.keys(relatives[node]).forEach((childKey) => {
      if (payload.nodes.includes(childKey)) {
        nodesToUpdate.push(node);
      }
    });
  });

  yield all([
    ...nodesToUpdate.map((nodeId) => loadRelated({ payload: { id: nodeId } })),
  ]);
}

function * cleanPreviewHistory () {
  yield put({ type: CLEAN_PREVIEW_HISTORY });
}

function * handleOpenLinkPreviewWindowfor ({ payload }) {
  yield all([yield put(hide()), yield put(hideMenu())]);
}

const allowedActions = [
  ADD_REORDERED_CHILD,
  ADD_REORDERED_CHILD,
  HIDE_BRANCH_PIPELINE,
  SHOW_SINGLE_NODE_VIEW,
  NEW_SEARCH_CONFIRMED,
  TOGGLE_ORBIT_LOCK,
  EXPAND_BRANCH,
  COLLAPSE_BRANCH,
  ADD_LINK,
  FOCUS_NODE,
  ADD_RELATED,
  HISTORY_NEXT,
  HISTORY_PREV,
];
/**
 * Creates or updates stored path when nodes, relatives, or focusedNode changes
 */
function * watchPathChanges () {
  if (!featureEnabled('savedPaths')) {
    return;
  }

  while (true) {
    const action = yield take('*');

    if (!allowedActions.includes(action.type)) {
      continue;
    }

    const fixedPathState = yield select((state) => state.fixedPath);

    const activePath = fixedPathState.get('activePath');
    const state = {
      nodes: fixedPathState.get('nodes'),
      relatives: fixedPathState.get('relatives'),
      focusedNode: fixedPathState.get('focusedNode'),
    };

    // TODO: probably should filter out paths that only have The Brane (from either searching it, or collapsing the Profile node)
    try {
      if (typeof activePath === 'number') {
        const { data } = yield createPath(state);
        const id = parseInt(data._id, 10);
        yield put({
          type: SET_PATH_ID,
          payload: {
            pathId: id,
          },
        });
      } else {
        yield updatePath(activePath, state);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

function * handleExportTopics () {
  const state = yield select(state => state.fixedPath.toJS())
  const filterWithin = yield select(selectFilterWithin())
  const tagFilters = yield select(selectTagFilters())
  const showOnOrbit = yield select(selectShowOnOrbit())
  const activeProperties = yield select(selectActiveProperties())

  const focused = state.nodes[state.focusedNode]
  const properties = yield call(getRelatedProperties, focused._id)
  let relatives = state.relatives[state.focusedNode]

  relatives = filterShowOnOrbit(relatives, showOnOrbit)

  if (filterWithin === 'current-children') {
    relatives = filterNodeObject(
      relatives,
      tagFilters
    )
  }

  if (activeProperties.length > 0) {
    relatives = pickBy(relatives, (relative) => {
      const nodeProperties = properties[relative._id] || []

      if (nodeProperties.length === 0) {
        return false
      }

      return nodeProperties.find((property) => {
        return activeProperties.find((activeProperty) => {
          if (activeProperty._id === property._id) {
            return activeProperty.selectedValues.length === 0 ||
              activeProperty.selectedValues.includes(property.value)
          }

          return false
        })
      })
    })
  }

  let {
    visibleChildren,
  } = childrenOnOrbit(
    relatives,
    {
      parentFrom: focused.from,
      noLimit: true,
      properties: Object.entries(properties).reduce((result, [ node, properties ]) => {
        result[node] = { properties };
        return result;
      }, {}),
      activeProperties: activeProperties,
      orbitLocked: false,
    }
  )

  const propertyNames = []
  const collected = [
    focused,
    ...visibleChildren,
  ].map(node => {
    node = clone(node)

    const {
      reference,
    } = node.additionalProperties || {};
    node.reference = reference;

    const nodeProperties = properties[node._id]
    if (nodeProperties) {
      nodeProperties.forEach(property => {
        node[property.title] = property.value
        if (!propertyNames.includes(property.title)) {
          propertyNames.push(property.title)
        }
      })
    }

    return node
  })

  const csv = generateCSV([
    '_id',
    '_type',
    'title',
    'description',
    'reference',
    ...propertyNames,
  ], collected)
  download('nodes.csv', csv)
}

function * onShowProfileMenu ({ payload }) {
  const nodeMenuOpen = yield select((state) => {
    return state.fixedPath.get('menu');
  });
  if (nodeMenuOpen) {
    yield put({ type: HIDE_MENU });
  }
}

export default function * rootSaga () {
  yield all([
    takeEvery(OPEN_LINK_PREVIEW_WINDOW_FOR, handleOpenLinkPreviewWindowfor),
    takeEvery(ADD_NODE, loadRelated),
    takeEvery(START_SEARCH, handleSearch),
    takeEvery(EXPORT_TOPICS, handleExportTopics),
    takeEvery(UPDATE_NODES, handleUpdateNodes),
    takeLatest(OPEN_PROFILE_MENU, onShowProfileMenu),
    fork(watchPathChanges),
    takeEvery(NEW_SEARCH_CONFIRMED, searchLoadRelated),
    takeEvery(NEW_SEARCH_CONFIRMED, cleanPreviewHistory),
  ]);
}
