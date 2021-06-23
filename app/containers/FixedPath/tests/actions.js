import expect from 'expect'
import {
  SHOW_MENU,
  HIDE_MENU,
  FOCUS_NODE,
  SHOW_SINGLE_NODE_VIEW,
  ADD_NODE,
  COLLAPSE_BRANCH,
  ADD_LINK,
} from '../constants'
import {
  showMenu,
  hideMenu,
  addNode,
  focusNode,
  showSingleNodeView,
  collapseBranch,
  addLink,
} from '../actions'

jest.mock('../../../constants', () => ({
  BRANE_NODE_ID: '0',
}))

describe('FixedPath actions', () => {
  it('showMenu', () => {
    let expected = {
      type: SHOW_MENU,
      payload: {
        node: {
          _id: 'test',
        },
        x: 5,
        y: 5,
        isChild: false,
        parentId: '0',
        angleOrRadius: 50,
      },
    }

    expect(
      showMenu(
        {
          _id: 'test',
        },
        5,
        5,
        false,
        '0',
        50
      )
    ).toEqual(expected)
  })
  it('hideMenu', () => {
    let expected = {
      type: HIDE_MENU,
    }
    expect(hideMenu()).toEqual(expected)
  })
  it('addNode', () => {
    let expected = {
      type: ADD_NODE,
      payload: {
        id: '0',
        _type: 'topic',
        title: 'test',
        sourceId: '1',
        angle: 50,
        isParent: true,
      },
    }
    expect(addNode({ id: '0', title: 'test', _type: 'topic' }, '1', 50, true)).toEqual(expected)
  })
  it('focusNode', () => {
    let expected = {
      type: FOCUS_NODE,
      payload: {
        id: '0',
      },
    }
    expect(focusNode('0')).toEqual(expected)
  })
  it('toggleNodeList', () => {
    let expected = {
      type: SHOW_SINGLE_NODE_VIEW,
      payload: {
        _id: '0',
        animationData: [],
      },
    }
    expect(showSingleNodeView('0', [])).toEqual(expected)
  })
  it('collapseBranch', () => {
    let expected = {
      type: COLLAPSE_BRANCH,
      payload: {
        id: '1',
        sourceNode: '2',
      },
    }
    expect(collapseBranch('1', '2')).toEqual(expected)
  })
  it('addLink', () => {
    let expected = {
      type: ADD_LINK,
      payload: {
        from: '2',
        to: '1',
        nodeTitle: 'Physics',
      },
    }
    expect(addLink('2', '1', 'Physics')).toEqual(expected)
  })
})
