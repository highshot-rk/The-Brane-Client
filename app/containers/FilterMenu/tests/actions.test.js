import expect from 'expect'

import {
  updateTagFilters,
  updateFrameReference,
  updateShowOnOrbit,
} from '../actions'

import {
  UPDATE_TAG_FILTERS,
  UPDATE_FRAME_REFERENCE,
  UPDATE_SHOW_ON_ORBIT,
} from '../constants'

describe('FilterMenu Actions', () => {
  it('updateTagFilters', () => {
    const expectedResult = {
      type: UPDATE_TAG_FILTERS,
      payload: {
        tagFilters: [{ _key: '1', title: 'science' }],
      },
    }

    expect(updateTagFilters([{ _key: '1', title: 'science' }])).toEqual(expectedResult)
  })
  it('updateFrameReference', () => {
    const expectedResult = {
      type: UPDATE_FRAME_REFERENCE,
      payload: {
        value: 'path-orbit',
      },
    }

    expect(updateFrameReference('path-orbit')).toEqual(expectedResult)
  })
  it('updateShowOnOrbit', () => {
    const expectedResult = {
      type: UPDATE_SHOW_ON_ORBIT,
      payload: {
        value: 'children',
      },
    }

    expect(updateShowOnOrbit('children')).toEqual(expectedResult)
  })
})
