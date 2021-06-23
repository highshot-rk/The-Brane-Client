import expect from 'expect'

import { showNodeCreationWindow, closeNodeCreationWindow, showLinkCreationWindow, closeLinkCreationWindow } from '../actions'
import { SHOW_NODE_CREATION_WINDOW, CLOSE_NODE_CREATION_WINDOW, SHOW_LINK_CREATION_WINDOW, CLOSE_LINK_CREATION_WINDOW } from '../constants'

describe('Home Actions', () => {
  it('showNodeCreationWindow', () => {
    const expectedResult = {
      type: SHOW_NODE_CREATION_WINDOW,
      payload: {
        parentId: '456',
        title: 'Gravity',
      },
    }

    expect(showNodeCreationWindow('456', 'Gravity')).toEqual(expectedResult)
  })
  it('closeNodeCreationWindow', () => {
    const expectedResult = {
      type: CLOSE_NODE_CREATION_WINDOW,
    }
    expect(closeNodeCreationWindow()).toEqual(expectedResult)
  })
  it('showLinkCreationWindow', () => {
    const expectedResult = {
      type: SHOW_LINK_CREATION_WINDOW,
      payload: {
        parentLink: '123',
        childLink: '456',
        replace: true,
      },
    }

    expect(showLinkCreationWindow('123', '456', true)).toEqual(expectedResult)
  })
  it('closeLinkCreationWindow', () => {
    const expectedResult = { type: CLOSE_LINK_CREATION_WINDOW }
    expect(closeLinkCreationWindow()).toEqual(expectedResult)
  })
})
