import {
  ADD_TOPIC_PROPERTIES, ACTIVATE_PROPERTY, DEACTIVATE_PROPERTY, SET_SORT_DIRECTION, ADD_STATISTICS, ADD_AVAILABLE_PROPERTIES, QUERY_CHANGED, PROPERTIES_LOADING, PROPERTIES_ERROR, EXPAND_PROPERTY, SET_SELECTED_VALUES,
} from './constants'

export function activatePropertyFilter ({
  _id,
  title,
  cluster,
  color,
}) {
  return {
    type: ACTIVATE_PROPERTY,
    payload: {
      _id,
      title,
      cluster,
      color,
    },
  }
}

export function propertyLoading (isFetching) {
  return {
    type: PROPERTIES_LOADING,
    payload: {
      isFetching,
    },
  }
}

export function propertyErrorMessage (error) {
  return {
    type: PROPERTIES_ERROR,
    payload: {
      error,
    },
  }
}

export function queryChanged (query) {
  return {
    type: QUERY_CHANGED,
    payload: query,
  }
}

export function deactivateProperty (_id, cluster) {
  return {
    type: DEACTIVATE_PROPERTY,
    payload: {
      _id,
      cluster,
    },
  }
}

export function addTopicProperties (properties) {
  return {
    type: ADD_TOPIC_PROPERTIES,
    payload: properties,
  }
}

export function addAvailableProperties ({
  properties,
}) {
  return {
    type: ADD_AVAILABLE_PROPERTIES,
    payload: {
      properties,
    },
  }
}

export function setSortDirection (propertyId, direction) {
  return {
    type: SET_SORT_DIRECTION,
    payload: {
      propertyId,
      direction,
    },
  }
}

export function addStatistics ({
  topicId,
  statistics,
}) {
  return {
    type: ADD_STATISTICS,
    payload: {
      topicId,
      statistics,
    },
  }
}

export function expandProperty (propertyId) {
  return {
    type: EXPAND_PROPERTY,
    payload: propertyId,
  }
}

export function setSelectedValues (propertyId, values) {
  return {
    type: SET_SELECTED_VALUES,
    payload: {
      propertyId,
      values,
    },
  }
}
