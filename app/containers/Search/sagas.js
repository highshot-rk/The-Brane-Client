import {
  UPDATE_FRAME_REFERENCE,
  UPDATE_QUERY,
  UPDATE_RESULTS,
  RESULTS_REQUESTED,
} from './constants'
import { put, select, take, throttle, spawn, fork, all, delay } from 'redux-saga/effects'

import Fuse from 'fuse.js'
import { defaultTo } from 'lodash-es'
import {
  loadAllBraneResults,
  loadFocusedRelatedResults,
  loadAllRelatedResults,
  loadAllNodesResults,
  vennDiagramResults,
} from './result-sources'
import { selectQueries, selectActiveQuery } from './selectors'
import { searchLoading } from './actions'

let resultIndex = 0
let lastLoadedIndex = -1

const FuseOptions = {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  findAllMatches: true,
  tokenize: true,
  keys: [
    'title',
  ],
}

const RESULT_THROTTLE_MS = 500

// Sorts results, with result having
// exact match to query being first,
// and rest sorted by number of children
export function sortResults (results, query) {
  query = query.toLowerCase()
  return results.sort((a, b) => {
    if (a.title.toLowerCase() === query) {
      return -1
    } else if (b.title.toLowerCase() === query) {
      return 1
    }
    return b.childCount - a.childCount
  }
  )
}

export function normalizeQuery (query = '') {
  const operators = [ '(', ')', '-' ]
  query = query.trim()

  if (operators.includes(query[0])) {
    query = query.slice(1)
  }

  if (operators.includes(query.slice(-1))) {
    query = query.slice(0, query.length - 1)
  }

  return query
}

/**
 * Removes any results that have been selected for other queries
 *
 * @param {Object[]} results
 */
function * removeAlreadyUsed (results) {
  const queries = yield select(state => state.search.get('queries').toJS())
  let usedIds = []
  const uniqueQueries = ['intersection', 'difference', 'subtraction']

  // Find all intersection queries until there is a different type
  // since it might be okay to use this query again after that
  // TODO: only check up to the active query
  for (let i = 0; i < queries.length; i++) {
    let query = queries[i]

    if (!uniqueQueries.includes(query.type) && query.type !== null) {
      usedIds = []
    }

    if (query.id) {
      usedIds.push(query.id)
    }
  }

  for (let i = results.length; i > 0; i--) {
    if (usedIds.indexOf(results[i - 1]._id) > -1) {
      results.splice(i - 1, 1)
    }
  }

  return results
}

export function fuzzySearchNodes (nodes, query) {
  const data = new Fuse(nodes, FuseOptions)
  return data.search(query)
}

function * getResults (frameReference, query, page) {
  switch (frameReference) {
    case 'all-brane':
      return yield loadAllBraneResults(query, page)
    case 'focused-related':
      return yield loadFocusedRelatedResults(query)
    case 'all-related':
      return yield loadAllRelatedResults(query)
    case 'all-nodes':
      return yield loadAllNodesResults(query)
    default:
      console.warn('Unknown frame reference')
  }
}

const clientSearch = [
  'focused-related',
  'all-related',
  'all-nodes',
]

function * loadResults (action) {
  const index = ++resultIndex
  const query = normalizeQuery(action.payload.query)
  const state = yield select(state => state.search.toJS())
  const queryIndex = defaultTo(action.payload.queryIndex, state.activeQuery)
  const frameReference = defaultTo(action.frameReference, state.filterWithin)
  const vennDiagram = defaultTo(action.vennDiagramSearch, state.vennDiagramSearch)
  const firstQuerySelected = state.queries[0].id !== null
  const operator = state.queries[queryIndex].type
  const startIndex = action.payload.startIndex || 0
  const page = {
    startIndex,
    stopIndex: action.payload.stopIndex || startIndex + 50,
  }
  let results
  let total = 0
  let tagCounts = {}
  if (vennDiagram && firstQuerySelected) {
    results = yield vennDiagramResults(query, state.queries[queryIndex].type, page)
  } else {
    yield put(searchLoading(true))
    results = yield getResults(frameReference, query, page)
  }
  if (index < lastLoadedIndex) {
    return
  }

  if (!Array.isArray(results) && typeof results === 'object') {
    total = results.total
    tagCounts = results.tagCounts
    results = results.results
  } else {
    console.warn('Search results being an array is depreciated')
  }

  lastLoadedIndex = index

  if (
    (!vennDiagram && clientSearch.includes(frameReference)) ||
    (vennDiagram && operator !== 'union' && query.length > 0)
  ) {
    results = fuzzySearchNodes(results, query)
  }

  results = sortResults(results, query)

  if (vennDiagram) {
    results = yield removeAlreadyUsed(results)
  }

  yield put({
    type: UPDATE_RESULTS,
    payload: { results, query: queryIndex, total, tagCounts, startIndex },
  })
  yield delay(1000)
  yield put(searchLoading(false))
}

function * watchUpdateFrameRefrence () {
  while (true) {
    yield take(UPDATE_FRAME_REFERENCE)
    const query = yield select((state) => state.search.toJS().queries[0].query)
    yield loadResults({ payload: { query } })
  }
}

function * watchRequestResults () {
  while (true) {
    const action = yield take(RESULTS_REQUESTED)
    const queries = yield select(selectQueries())
    const activeQuery = yield select(selectActiveQuery())
    yield spawn(loadResults, {
      payload: {
        ...action.payload,
        query: queries[activeQuery].query,
      },
    })
  }
}

export default function * rootSaga () {
  yield all([
    fork(watchRequestResults),
    fork(watchUpdateFrameRefrence),
    throttle(RESULT_THROTTLE_MS, UPDATE_QUERY, loadResults),
  ])
}
