import * as cache from '../cache'

describe('cache', () => {
  describe('checkCache', () => {
    it('should return null if not in cache', async () => {
      const result = await cache.getResponse('/__non-existant/32479894798042891')
      expect(result).toEqual(null)
    })
  })
})
