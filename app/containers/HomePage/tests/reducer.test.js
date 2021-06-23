import {
  OPEN_SIDEBAR_MENU,
} from '../constants'
import expect from 'expect'
import homeReducer, { _initialState } from '../reducer'
import { cloneDeep } from 'lodash-es'

describe('homeReducer', () => {
  let state
  let expectedState

  beforeEach(() => {
    state = cloneDeep(_initialState)

    expectedState = cloneDeep(_initialState)
  })

  it('should return the initial state', () => {
    expect(homeReducer(undefined, {})).toEqual(expectedState)
  })
  it('should handle the openSidebarMenu action', () => {
    const action = {
      type: OPEN_SIDEBAR_MENU,
      menu: 'search',
    }

    expectedState.sideBarMenu = 'search'

    expect(homeReducer(state, action)).toEqual(expectedState)
  })
})
