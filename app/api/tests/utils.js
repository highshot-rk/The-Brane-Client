import {
  ensureId,
  ensureKey,
} from '../utils'

describe('api utils', () => {
  describe('ensureId', () => {
    it('should convert keys to ids', () => {
      expect(ensureId('123456', 'topics')).toEqual('topics/123456')
    })
    it('should not modify ids', () => {
      expect(ensureId('topics/12345', 'topics')).toEqual('topics/12345')
    })
  })

  describe('ensureKey', () => {
    it('should convert ids to keys', () => {
      expect(ensureKey('topics/123456')).toEqual('123456')
    })
    it('should not modify keys', () => {
      expect(ensureKey('12345')).toEqual('12345')
    })
  })
})
