import {
  UPDATE_TAG_FILTERS,
  UPDATE_FRAME_REFERENCE,
  UPDATE_SHOW_ON_ORBIT,
} from './constants.js'
import { injectReducer } from 'redux-injectors'

const initialState = {
  filterWithin: 'current-children',
  tagFilters: [],
  showOnOrbit: 'all',
}

export default function filterMenuReducer (state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_TAG_FILTERS:
      return {
        ...state,
        tagFilters: [
          ...payload.tagFilters,
        ],
      }
    case UPDATE_FRAME_REFERENCE:
      return {
        ...state,
        filterWithin: payload.value,
      }

    case UPDATE_SHOW_ON_ORBIT:
      return {
        ...state,
        showOnOrbit: payload.value,
      }

    default:
      return state
  }
}

export const composeFilterMenuReducer = [
  injectReducer({ key: 'filterMenu', reducer: filterMenuReducer }),
]
