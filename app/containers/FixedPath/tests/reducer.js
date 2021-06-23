import {
  ADD_NODE,
  ADD_RELATED,
  FOCUS_NODE,
  HIDE_MENU,
  NEW_SEARCH,
  SHOW_MENU,
  SHOW_SINGLE_NODE_VIEW,
} from '../constants'
import reducer, { _initialState } from '../reducer'

import { fromJS } from 'immutable'

jest.mock('utils/injectData', () => ({
  getData: () => ({
    rootNode: {
      _id: '0',
      title: 'The Brane',
    },
    links: [],
  }),
}))
jest.mock('../../../constants', () => ({
  BRANE_NODE_ID: '0',
}))

describe('Fixed Path Reducer', () => {
  let initialState = _initialState

  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })
  it('should handle show menu action', () => {
    let expectedState = initialState.set('menu', {
      node: {
        _id: '1',
        title: 'test',
        angle: 50,
      },
      x: 5,
      y: 5,
      isChild: true,
      parentId: '2',
    })

    expect(reducer(initialState, {
      type: SHOW_MENU,
      payload: {
        node: {
          _id: '1',
          title: 'test',
        },
        angleOrRadius: 50,
        x: 5,
        y: 5,
        isChild: true,
        parentId: '2',
      },
    })).toEqual(expectedState)
  })
  it('should handle hide menu action', () => {
    let expected = initialState.set('menu', null)
    expect(reducer(initialState, { type: HIDE_MENU })).toEqual(expected)
  })
  it('should handle show single node view action', () => {
    const action = { type: SHOW_SINGLE_NODE_VIEW, payload: { _id: '0', animationData: [] } }
    let expected = initialState.setIn(['singleNodeView', 'show'], true)
      .setIn(['animationData', 'id'], 0)
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it.skip('should handle start search action', () => {
    let expected = initialState.set('nodes', fromJS({
      '1': {
        _id: '1',
        title: 'test',
        from: {},
      },
    }
    ))
    expected = expected.set('relatives', fromJS({
      '1': {
        '2': {
          _id: '2',
          title: 'test2',
          family: 'Science',
          group: 'Applied science',
          tag: 'Discipline',
        },
      },
    }))
    expected = expected.set('history', fromJS(['1']))
    expected = expected.set('historyIndex', 0)
    expected = expected.set('focusedNode', '1')
    expected = expected.set('showNodeList', false)

    const action = {
      type: NEW_SEARCH,
      payload: {
        results: {
          _id: '1',
          title: 'test',
          relatives: [
            {
              _id: '2',
              title: 'test2',
              family: 'Science',
              group: 'Applied science',
              tag: 'Discipline',
            },
          ],
        },
      },
    }
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it('should handle add related action', () => {
    let expected = initialState.setIn(['relatives', '5'], fromJS({
      '6': {
        _id: '6',
        _type: 'cluster',
        title: 'test6',
        childCount: 10,
        parentCount: 5,
        tagList: [],
        linkType: 'link',
        linkName: 'studies',
        linkDirection: 'child',
      },
    })).setIn(['nodes', '5'], fromJS({
      _type: 'cluster',
      _id: '5',
      title: 'Science',
    }))
    let action = {
      type: ADD_RELATED,
      payload: {
        parentId: '5',
        nodeId: '5',
        _type: 'cluster',
        nodeTitle: 'Science',
        relatives: [
          {
            _id: '6',
            _type: 'cluster',
            title: 'test6',
            childCount: 10,
            parentCount: 5,
            tagList: [],
            linkType: 'link',
            linkName: 'studies',
            linkDirection: 'child',
          },
        ],
      },
    }
    expect(reducer(initialState, action)).toEqual(expected)
  })
  it.skip('should handle add node action', () => {
    let expected = initialState.setIn(['relatives', '0', '2', 'expanded'], 0)
    expected = expected.setIn(['relatives', '0', '2', 'collapsed'], false)
    expected = expected.setIn(['relatives', '2'], fromJS({}))
    expected = expected.setIn(['nodes', '2'], fromJS({
      _id: '2',
      title: 'test2',
      from: {
        '0': {
          angle: 45,
        },
      },
    }))
    expected = expected.set('history', fromJS(['0', '2']))
    expected = expected.set('historyIndex', 1)
    expected = expected.set('focusedNode', '2')
    expected = expected.set('showNodeList', false)

    const action = {
      type: ADD_NODE,
      payload: {
        sourceId: '0',
        id: '2',
        title: 'test2',
        angle: 45,
      },
    }

    expect(reducer(initialState, action)).toEqual(expected)
  })
  it.skip('should handle focus node action', () => {
    let expected = initialState.set('focusedNode', '1')
    expected = expected.set('showNodeList', false)
    const action = {
      type: FOCUS_NODE,
      payload: {
        id: '1',
      },
    }
    expect(reducer(initialState, action)).toEqual(expected)
  })
})
