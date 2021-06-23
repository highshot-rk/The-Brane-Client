import { call, select } from 'redux-saga/effects'
import { searchNodes, getVennSuggestions } from 'api/node'
import { memoize } from '../../utils/memoize'
import {
  vennResults,
  allInputIds,
} from 'utils/venn-results'
import {
  differenceBy,
  intersectionBy,
  flatten,
} from 'lodash-es'
import { createNode } from 'utils/factories'

const MINUTE = 1000 * 60 * 10
const memoizedVennResults = memoize(getVennSuggestions, { maxAge: MINUTE })

export function * loadAllBraneResults (query, page) {
  if (query.length > 0) {
    try {
      let limit = page.stopIndex - page.startIndex + 1
      let result = yield call(searchNodes, query, { limit, from: page.startIndex })
      return result
    } catch (e) {
      // TODO: show error or retry
      console.error(e, query)
    }
  }

  return []
}

export function * loadFocusedRelatedResults () {
  return yield select(state => {
    const fixedPathState = state.fixedPath.toJS()
    const focused = fixedPathState.focusedNode
    const children = Object.values(fixedPathState.children[focused])
    const parents = fixedPathState.parents[focused].map(parent => createNode(parent))

    return children.concat(parents)
  })
}

export function * loadAllRelatedResults () {
  const childrenParents = yield select(state => Object.values(state.fixedPath.toJS().children))
  const children = childrenParents.reduce((result, children) => {
    result.push(...Object.values(children))
    return result
  }, [])

  const parents = yield select(state => Object.values(state.fixedPath.toJS().parents))
  return flatten(parents).concat(children).map(result => createNode(result))
}

export function * loadAllNodesResults () {
  return yield select(state => Object.values(state.fixedPath.toJS().nodes).map(node => createNode(node)))
}

export function * vennDiagramResults (query, operator, page) {
  let results = []
  const queries = yield select(state => state.search.toJS().queries)
  const lockedQueries = queries.slice(0, queries.findIndex(query => query.id === null))

  if (operator === 'union') {
    return yield loadAllBraneResults(query, page)
  } else if (lockedQueries.length < 2) {
    const selectedId = queries[0].id
    results = yield call(memoizedVennResults, selectedId.split('/')[1], operator)
    return results
      .filter(result => result.childCount > 0 || result.parentCount > 0)
  }

  function getParentChildren (nodeKey) {
    return memoizedVennResults(nodeKey)
  }

  async function intersection (input) {
    const allIds = allInputIds(input)
    let intersectionInput = []

    if (allIds) {
      intersectionInput = [
        await getParentChildren(input[0].value),
        await getParentChildren(input[1].value),
      ]
    } else {
      intersectionInput = [
        input[0].value,
        input[1].value,
      ]
    }

    return intersectionBy(...intersectionInput, '_id')
  }

  function handleOperator (operator, input) {
    switch (operator) {
      case 'intersection':
        return intersection(input)
      case 'union':
        return input.reduce((result, info) => info.value ? result.concat(info.value) : result, [])
      case 'difference':
        return differenceBy(input[0].value, input[1].value, '_id')
      // no default
    }
  }

  results = yield call(vennResults,
    lockedQueries,
    handleOperator,
    getParentChildren
  )

  if (!results || results.length === 0) {
    return []
  }

  return results
}
