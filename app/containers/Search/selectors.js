import { createSelector } from 'utils/redux'
import { registerSelectors } from 'reselect-tools'

const selectSearch = (state) => state.search
registerSelectors({ 'selectSearch': selectSearch })

const selectPropFactory = (property) =>
  createSelector(
    `search${property}`,
    selectSearch,
    (searchState) => searchState.get(property)
  )

const selectTagFilters = () => selectPropFactory('tagFilters')

const selectFilterWithin = () => selectPropFactory('filterWithin')

const selectQueries = () => createSelector(
  'queries',
  selectPropFactory('queries'),
  (queries) => queries.toJS()
)

const selectVennDiagramSearch = () => selectPropFactory('vennDiagramSearch')

const selectQueriesLocked = () => selectPropFactory('queriesLocked')

const selectActiveQuery = () => selectPropFactory('activeQuery')

const selectLoading = () => selectPropFactory('loading')

const selectResults = () => createSelector(
  'results',
  selectPropFactory('results'),
  // Sometimes the results are an array even though they should always be an immutable.js list
  // TODO: fix this
  results => Array.isArray(results) ? results : results.toJS()
)

const selectTotalResults = () => selectPropFactory('totalResults')

const selectFetching = () => createSelector(
  'isFetching',
  selectPropFactory('isFetching'),
  (state) => {
    if (state) {
      return state.query
    } else {
      return null
    }
  }
)

const selectTagCounts = () => selectPropFactory('tagCounts')

export {
  selectTagFilters,
  selectFilterWithin,
  selectResults,
  selectQueries,
  selectVennDiagramSearch,
  selectQueriesLocked,
  selectActiveQuery,
  selectLoading,
  selectTotalResults,
  selectFetching,
  selectTagCounts,
}
