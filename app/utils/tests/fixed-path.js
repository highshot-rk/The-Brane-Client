import {
  closestQuadrant,
  relativesOnOrbit,
  MAX_VISIBLE_RELATIVES,
  expandedRelatives,
} from '../fixed-path'

describe('Fixed Path Utils', () => {
  describe('closestQuadrant', () => {
    it('should find closest quadrant', () => {
      let quadrants = [45, 135]
      let angle = 30
      expect(closestQuadrant(angle, quadrants)).toEqual(45)
      expect(closestQuadrant(150, quadrants)).toEqual(135)
    })
    it('should work when quadrant and angle are on both sides of 0 deg', () => {
      let quadrants = [45, 225]
      let angle = 355
      expect(closestQuadrant(angle, quadrants)).toEqual(45)
    })
    it('should not mutate available positions', () => {
      // it would in certain situations add -45 and 405 to the array
      let quadrants = [45, 315]
      closestQuadrant(355, quadrants)
      expect(quadrants).toEqual([45, 315])
    })
  })
  describe('relativesOnOrbit', () => {
    function createChildren (count) {
      const children = []
      for (let i = 0; i < count; i++) {
        children.push({
          _id: i.toString(),
          childCount: i,
          parentCount: i,
        })
      }

      return children
    }
    it('should sort children by count', () => {
      const children = {
        1: {
          _id: '1',
          childCount: 1,
          parentCount: 1,
        },
        3: {
          _id: '3',
          childCount: 3,
          parentCount: 3,
        },
        2: {
          _id: '2',
          childCount: 2,
          parentCount: 2,
        },
      }
      const result = relativesOnOrbit(children).visibleChildren
      expect(result.map(item => item._id)).toEqual([
        '3',
        '2',
        '1',
      ])
    })
    it('should append gateways if not visible', () => {
      const children = createChildren(30)
      children[0].gateway = true
      const result = relativesOnOrbit(children)

      expect(result.visibleChildren[MAX_VISIBLE_RELATIVES - 1].gateway).toEqual(true)
      expect(result.hasGatewayChildren).toEqual(true)
    })
    it('should preserve gateway location if normally visible', () => {
      const children = createChildren(30)
      children[29].gateway = true
      const result = relativesOnOrbit(children)

      expect(result.visibleChildren[0].gateway).toEqual(true)
    })
    it('should make child gateway if parent is from it as a gateway', () => {
      const children = createChildren(30)
      console.log(JSON.stringify(children))
      const result = relativesOnOrbit(
        children,
        {
          parentFrom: { 29: { gateway: true } },
        }
      )

      expect(result.visibleChildren[0].gateway).toEqual(true)
    })
    it('should place parent clusters in beginning', () => {
      const children = createChildren(20)
      children.push({
        _id: '21',
        count: 2,
        linkDirection: 'parent',
        _type: 'cluster',
      })

      const result = relativesOnOrbit(children)
      expect(result.visibleChildren[0].linkDirection).toEqual('parent')
    })
  })

  describe('expandedRelatives', () => {
    it('should identify main branch and branch offs', () => {
      const node = {
        outgoing: [
          { _id: '0', title: 'Humanity' },
          { _id: '1', title: 'Science' },
        ],
      }

      const nodes = {
        '0': {
          _id: '0',
          title: 'Humanity',
          outgoing: [
            { _id: '2', title: 'Gravity' },
          ],
        },
        '1': {
          _id: '1',
          title: 'Science',
          outgoing: [],
        },
        '2': {
          _id: '2',
          title: 'Gravity',
          outgoing: [],
        },
      }

      const result = expandedRelatives(node, nodes)
      expect(result).toMatchSnapshot()
    })
  })
})
