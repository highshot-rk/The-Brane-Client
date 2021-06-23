import {
  generateCSV,
} from '../export-downloadable'

describe('Export CSV', () => {
  describe('generateCSV', () => {
    it('should have title row', () => {
      const expected = '"name","type","description"'
      const result = generateCSV(['name', 'type', 'description'], [])

      expect(result).toEqual(expected)
    })
    it('should add row for each item', () => {
      const expected = `"name","type"\n"a","test"\n"b","test"\n"c","normal"`
      const items = [
        { name: 'a', type: 'test' },
        { name: 'b', type: 'test' },
        { name: 'c', type: 'normal' },
      ]
      const result = generateCSV(['name', 'type'], items)
      expect(result).toEqual(expected)
    })
  })
})
