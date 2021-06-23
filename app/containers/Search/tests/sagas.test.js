import {
  sortResults,
} from '../sagas'

jest.mock('utils/filter-tags', () => ({
}))
jest.mock('utils/tags', () => ({
  createTagList (parents) {
    return parents
  },
  isCluster (node) {
    return ['cluster', 'property'].includes(node._type)
  },
}))

describe('Search Sagas', () => {
  describe('sortResults', () => {
    function prepareOrder (results) {
      return results.map(result => {
        return result.title
      })
    }

    it('should sort by count', () => {
      const results = [{
        title: 'a',
        childCount: 1,
      }, {
        title: 'b',
        childCount: 3,
      }, {
        title: 'c',
        childCount: 2,
      }]

      expect(prepareOrder(sortResults(results, 'z'))).toEqual(['b', 'c', 'a'])
    })
    it('should move exact match to top', () => {
      const results = [{
        title: 'a',
        childCount: 1,
      }, {
        title: 'b',
        childCount: 3,
      }, {
        title: 'c',
        childCount: 2,
      }]

      expect(prepareOrder(sortResults(results, 'c'))).toEqual(['c', 'b', 'a'])
    })
    it('should handle results with name property', () => {
      const results = [{
        title: 'a',
        childCount: 1,
      }, {
        title: 'b',
        childCount: 3,
      }, {
        title: 'c',
        childCount: 2,
      }]

      expect(prepareOrder(sortResults(results, 'z'))).toEqual(['b', 'c', 'a'])
    })
  })
})
