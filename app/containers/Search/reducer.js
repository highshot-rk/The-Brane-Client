import {
  ADD_QUERY,
  QUERIES_LOCKED,
  REMOVE_QUERY,
  UPDATE_FRAME_REFERENCE,
  UPDATE_QUERY,
  UPDATE_RESULTS,
  UPDATE_SELECTED,
  UPDATE_TAG_FILTERS,
  UPDATE_OPERATOR,
  UPDATE_ACTIVE_QUERY,
  SEARCH_LOADING,
} from './constants.js'

import { fromJS } from 'immutable'
import saga from './sagas'
import { injectReducer, injectSaga } from 'redux-injectors'

const initialState = fromJS({
  filterWithin: 'all-brane',
  tagFilters: [],
  results: fromJS([]),
  totalResults: 0,
  tagCounts: {},
  queries: [
    fromJS({
      query: '',
      id: null,
      type: null,
    }),
  ],
  activeQuery: 0,
  queriesLocked: false,
  vennDiagramSearch: false,
  fixedPathChanged: false,
  loading: false,
})
  // set results and tagFilters initial value to plain array consistency
  .set('results', [])
  .set('tagFilters', [])

export default function searchReducer (state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_TAG_FILTERS:
      return state.set('tagFilters', payload.tagFilters)

    case UPDATE_RESULTS:
      // Ignore results for a previous active query that were loaded after
      // the active query changed
      if (payload.query === state.get('activeQuery')) {
        state = state.set('loading', false)
          .set('totalResults', payload.total.value)
          .set('tagCounts', payload.tagCounts)

        if (payload.startIndex === 0) {
          // This is the first page of results, so we can override the previous results
          return state.set('results', fromJS(payload.results))
        } else {
          return state.update('results', results => {
            let removeCount = payload.results.length
            let newResults = payload.results

            if (results.size > payload.startIndex + removeCount) {
              // Immutable does not like us to remove more items than exist
              removeCount = results.size - payload.startIndex
            }

            if (results.size < payload.startIndex) {
              // Immutable does not like skipping numbers
              // If there is a gap between the results in the store and the new results,
              // add undefined elements between them
              const empty = []
              for (let i = results.size; i < payload.startIndex; i++) {
                empty.push(undefined)
              }
              newResults = [...empty, ...newResults]
            }

            return results.splice(payload.startIndex, removeCount, ...newResults)
          })
        }
      }

      return state

    case UPDATE_QUERY:
      return state.update('results', (results) => {
        return payload.query.length ? results : []
      })
        .setIn(['queries', payload.queryIndex, 'query'], payload.query)
        .setIn(['queries', payload.queryIndex, 'id'], null)
        .set('queriesLocked', false)
        .set('loading', (payload.queryIndex > 0 && payload.query.length === 0) || payload.query.length > 0)

    case ADD_QUERY:
      const index = typeof payload.index === 'number' ? payload.index : state.get('queries').size
      return state.set('vennDiagramSearch', true)
        .update('queries', (queries) => {
          return queries.insert(index, fromJS({
            query: '',
            id: null,
            type: payload.type,
          }))
        })
        .set('loading', true)

    case REMOVE_QUERY:
      state = state.update('queries', queries => {
        const index = typeof payload.index === 'number' ? payload.index : queries.size - 1
        queries = queries.splice(index, 1)
        return queries
      }).update('activeQuery', activeQuery => activeQuery < 1 ? 0 : activeQuery - 1)
      if (state.get('queries').toJS().length === 1) {
        state = state.set('vennDiagramSearch', false)
      }

      return state

    case UPDATE_ACTIVE_QUERY: {
      let currentActiveQuery = state.get('activeQuery')
      return state.set('activeQuery', payload.index)
        .update(
          'results',
          results => currentActiveQuery !== payload.index ? [] : results
        )
        .set('loading', true)
    }

    case UPDATE_OPERATOR:
      return state.setIn(['queries', payload.index, 'type'], payload.operator).set('loading', true)

    case UPDATE_SELECTED:
      return state.setIn(['queries', payload.queryIndex, 'id'], payload.id)
        .setIn(['queries', payload.queryIndex, 'query'], payload.name)
        .set('results', [])
        .set('loading', true)

    case QUERIES_LOCKED:
      return state.set('queriesLocked', true)
        .set('tagFilters', [])
        .set('results', [])
        .set('loading', false)

    case UPDATE_FRAME_REFERENCE:
      return state.set('filterWithin', payload.name)

    case SEARCH_LOADING:
      return state.set('isFetching', payload)

    default:
      return state
  }
}

export const composeSearchReducer = [
  injectReducer({ key: 'search', reducer: searchReducer }),
  injectSaga({ key: 'search', saga }),
]
