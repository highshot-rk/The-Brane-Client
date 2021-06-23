import {
  ADD_QUERY,
  UPDATE_ACTIVE_QUERY,
  QUERIES_LOCKED,
  REMOVE_QUERY,
  SEARCH,
  UPDATE_FRAME_REFERENCE,
  UPDATE_QUERY,
  UPDATE_SELECTED,
  UPDATE_TAG_FILTERS,
  UPDATE_OPERATOR,
  RESULTS_REQUESTED,
  SEARCH_LOADING,
} from './constants.js'

export function updateTagFilters (tagFilters) {
  return {
    type: UPDATE_TAG_FILTERS,
    payload: {
      tagFilters,
    },
  }
}

export function updateQuery (query, queryIndex) {
  return {
    type: UPDATE_QUERY,
    payload: {
      query,
      queryIndex,
    },
  }
}

export function addQuery (type, index) {
  return {
    type: ADD_QUERY,
    payload: {
      type,
      index,
    },
  }
}

export function updateActiveQuery (index) {
  return {
    type: UPDATE_ACTIVE_QUERY,
    payload: {
      index,
    },
  }
}

export function removeQuery (index) {
  return {
    type: REMOVE_QUERY,
    payload: {
      index,
    },
  }
}

export function updateOperator (index, operator) {
  return {
    type: UPDATE_OPERATOR,
    payload: {
      index,
      operator,
    },
  }
}

export function updateSelected (id, name, queryIndex) {
  return {
    type: UPDATE_SELECTED,
    payload: {
      id,
      queryIndex,
      name,
    },
  }
}

export function queriesLocked () {
  return {
    type: QUERIES_LOCKED,
  }
}

export function updateFrameReference (name) {
  return {
    type: UPDATE_FRAME_REFERENCE,
    payload: {
      name,
    },
  }
}

export function search (query) {
  return {
    type: SEARCH,
    payload: {
      query,
    },
  }
}

export function searchLoading (query) {
  return {
    type: SEARCH_LOADING,
    payload: {
      query,
    },
  }
}

export function requestResults (startIndex, stopIndex) {
  return {
    type: RESULTS_REQUESTED,
    payload: {
      startIndex,
      stopIndex,
    },
  }
}
