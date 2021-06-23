import {
  UPDATE_TAG_FILTERS,
  UPDATE_FRAME_REFERENCE,
  UPDATE_SHOW_ON_ORBIT,
} from './constants.js'

export function updateTagFilters (tagFilters) {
  return {
    type: UPDATE_TAG_FILTERS,
    payload: {
      tagFilters,
    },
  }
}

export function updateFrameReference (value) {
  return {
    type: UPDATE_FRAME_REFERENCE,
    payload: {
      value,
    },
  }
}

export function updateShowOnOrbit (value) {
  return {
    type: UPDATE_SHOW_ON_ORBIT,
    payload: {
      value,
    },
  }
}
