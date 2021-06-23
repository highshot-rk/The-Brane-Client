import { createSelector } from 'utils/redux'
import { selectFocusedNode } from 'containers/FixedPath/selectors'
import {
  uniqBy,
  flatten,
  uniq,
} from 'lodash-es'

function selectProperty (property) {
  const raw = () => createSelector(
    `${property}Raw`,
    selectPropertyFiltersDomain(),
    (substate) => substate.get(property)
  )

  const finished = () => createSelector(
    `${property}Finished`,
    raw(),
    (substate) => substate.toJS()
  )

  return finished
}

const selectPropertyFiltersDomain = () => (state) => state.propertyFilters

export const selectPropertyFilters = () => createSelector(
  'propertyFilters',
  selectPropertyFiltersDomain(),
  (substate) => substate.toJS()
)

export const selectActiveProperties = selectProperty('activeProperties')

export const selectAvailableProperties = () => createSelector(
  'availableProperties',
  selectFocusedNodeProperties(),
  (properties) => {
    properties = Object.values(properties)
      .map(({ properties }) =>
        properties.map(property => ({ _id: property._id, title: property.title, cluster: property.cluster })))

    return uniqBy(flatten(properties), (property) => {
      return `${property._id}-${property.cluster}`
    })
  },
)

export const selectAvailableFilteredProperties = () => createSelector(
  'availableFilteredProperties',
  selectQuery(),
  selectAvailableProperties(),
  selectActiveProperties(),
  (query, properties, active) => {
    const activeIds = active.map(property => property._id)
    query = query.toLowerCase()

    return properties.filter(property => {
      if (activeIds.includes(property._id)) {
        return false
      }
      if (query && !property.title.toLowerCase().includes(query)) {
        return false
      }

      return true
    })
  }
)

export const selectFocusedNodeProperties = () => createSelector(
  'selectFocusedNodeProperties',
  [selectFocusedNode, selectPropertiesByTopic()],
  (focused, propertiesByTopic) => {
    if (!focused) {
      return []
    }

    return focused.relatives
      .map(relative => relative._id)
      .map(_id => ({ topic: _id, properties: propertiesByTopic.get(_id) || [] }))
      .reduce((result, item) => {
        result[item.topic] = item
        return result
      }, {})
  }
)

export const selectStatistics = () => createSelector(
  'statistics',
  selectPropertyFiltersDomain(),
  (substate) => substate.get('statistics'),
)

export const selectPropertiesByTopic = () => createSelector(
  'propertiesByTopic',
  selectPropertyFiltersDomain(),
  (substate) => substate.get('propertiesByTopic')
)

export const selectFocusedNodeHasProperties = () => createSelector(
  'focusedNodeHasProperties',
  [selectFocusedNodeProperties()],
  (focusedNodeProperties) => {
    return Object.values(focusedNodeProperties).find(({ properties }) => properties.length > 0)
  }
)

export const selectQuery = () => createSelector(
  'query',
  selectPropertyFiltersDomain(),
  (substate) => substate.get('query')
)

export const selectFetching = () => createSelector(
  'isFetching',
  selectPropertyFiltersDomain(),
  (state) => {
    const result = state.get('isFetching')
    return result.isFetching
  }
)

export const selectPropertyNetworkError = () => createSelector(
  'propertyNetworkError',
  selectPropertyFiltersDomain(),
  (state) => {
    const result = state.get('propertyNetworkError')
    if (result) {
      return result
    } else {
      return null
    }
  }
)

export const selectExpandedProperty = () => createSelector(
  'expandedProperty',
  selectPropertyFiltersDomain(),
  (substate) => substate.get('expandedProperty')
)

export const selectProps = () => (state, props) => props

export const selectPropertyValues = () => createSelector(
  'propertyValues',
  selectProps(),
  selectStatistics(),
  (props, statistics) => {
    return uniq(statistics.find(stats => stats.propertyId === props.id).values || [])
  }
)

export const selectSelectedValues = () => createSelector(
  'selectedValues',
  selectProps(),
  selectActiveProperties(),
  (props, properties) => properties.find(property => property._id === props.id).selectedValues
)

export default selectPropertyFilters
