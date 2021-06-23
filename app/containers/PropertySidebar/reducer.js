import { fromJS } from 'immutable'
import {
  ACTIVATE_PROPERTY, ADD_TOPIC_PROPERTIES, DEACTIVATE_PROPERTY, SET_SORT_DIRECTION, ADD_STATISTICS, QUERY_CHANGED, PROPERTIES_LOADING, PROPERTIES_ERROR, EXPAND_PROPERTY, SET_SELECTED_VALUES,
} from './constants'
import { SORT_DESCENDING } from 'utils/constants'
import { injectReducer, injectSaga } from 'redux-injectors'
import saga from './saga'

const initialState = fromJS({
  propertiesByTopic: fromJS({}),
  statistics: fromJS([]),
  activeProperties: fromJS([]),
  query: '',
  isFetching: false,
  expandedProperty: null,
}).set('statistics', [])

function propertyFiltersReducer (state = initialState, { type, payload }) {
  switch (type) {
    case ACTIVATE_PROPERTY:
      return state.update('activeProperties', activeProperties => activeProperties.push({
        ...payload,
        selectedValues: [],
        sortDirection: SORT_DESCENDING,
      }))

    case DEACTIVATE_PROPERTY:
      return state.update('activeProperties', activeProperties => activeProperties.filter(property =>
        property._id !== payload._id && property.cluster !== payload.cluster
      ))

    case ADD_TOPIC_PROPERTIES:
      return Object.entries(payload).reduce((state, [ key, properties ]) => {
        return state.setIn(['propertiesByTopic', key], properties.map(property => ({
          _id: property._id,
          title: property.title,
          value: property.value,
          cluster: property.cluster || 'Other',
        })))
      }, state)

    case SET_SORT_DIRECTION:
      return state.update('activeProperties', activeProperties => {
        return activeProperties.map(activeProperty => {
          if (activeProperty._id === payload.propertyId) {
            return {
              ...activeProperty,
              sortDirection: payload.direction,
            }
          }
          return activeProperty
        })
      })

    case ADD_STATISTICS:
      return state.set('statistics', payload.statistics)

    case QUERY_CHANGED:
      return state.set('query', payload)

    case PROPERTIES_LOADING:
      return state.set('isFetching', payload)
    case PROPERTIES_ERROR:
      return state.set('propertyNetworkError', payload.error)
    case EXPAND_PROPERTY:
      return state.set('expandedProperty', payload)

    case SET_SELECTED_VALUES:
      return state.update('activeProperties', activeProperties => {
        return activeProperties.map(property => {
          if (property._id === payload.propertyId) {
            return {
              ...property,
              selectedValues: payload.values,
            }
          }

          return property
        })
      })

    default:
      return state
  }
}

export default propertyFiltersReducer

export const composePropertyReducer = [
  injectReducer({ key: 'propertyFilters', reducer: propertyFiltersReducer }),
  injectSaga({ key: 'propertyFilters', saga }),
]
