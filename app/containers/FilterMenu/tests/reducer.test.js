import {
  UPDATE_FRAME_REFERENCE,
  UPDATE_TAG_FILTERS,
  UPDATE_SHOW_ON_ORBIT,
} from '../constants'
import expect from 'expect'
import filterReducer from '../reducer'

describe('FilterMenu Reducer', () => {
  let state
  let expectedState

  beforeEach(() => {
    state = {
      filterWithin: 'current-children',
      tagFilters: [],
      showOnOrbit: 'all',
    }

    expectedState = Object.assign({}, state)
  })

  it('should return the initial state', () => {
    expect(filterReducer(state, {})).toEqual(expectedState)
  })
  it('should handle the updateTagFilters action', () => {
    const action = {
      type: UPDATE_TAG_FILTERS,
      payload: {
        tagFilters: [{ _id: '0', title: 'Science' }],
      },
    }

    expectedState.tagFilters = [{ _id: '0', title: 'Science' }]

    expect(filterReducer(state, action)).toEqual(expectedState)
  })
  it('should handle the updateFrameReference action', () => {
    const action = {
      type: UPDATE_FRAME_REFERENCE,
      payload: {
        value: 'children-orbit',
      },
    }

    expectedState.filterWithin = 'children-orbit'

    expect(filterReducer(state, action)).toEqual(expectedState)
  })
  it('should handle the updateShowOnOrbit action', () => {
    const action = {
      type: UPDATE_SHOW_ON_ORBIT,
      payload: {
        value: 'parents',
      },
    }

    expectedState.showOnOrbit = 'parents'

    expect(filterReducer(state, action)).toEqual(expectedState)
  })
})
