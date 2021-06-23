import expect from 'expect'

import { selectRouter } from 'containers/App/selectors'

describe('selectLocationState', () => {
  it('should select the route as a plain JS object', () => {
    const router = {
      location: {},
    }
    const mockedState = {
      router,
    }
    expect(selectRouter(mockedState)).toEqual(router)
  })
})
