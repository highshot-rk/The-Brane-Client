import layout, {
  GRID_SPACING,
  adjacent,
  availablePos,
  checkAngleIs90,
  crossOver90deg,
  findOutgoing,
  nodeOriginallyFrom,
  nodePos,
  prepareNextNodes,
} from '../layout'

import expect from 'expect'

function createNode (x, y, expand = false) {
  return {
    x: expand ? x * GRID_SPACING.x : x,
    y: expand ? y * GRID_SPACING.y : y,
  }
}

/*
 * Node 0 > Node 1@45deg
 * Node 1 > Node 2@135deg
 * Node 2 > Node 3@225 deg
 * Node 3 > Node 4@225 deg
 * Node 4 > Node 2 Gateway
 * Node 0 > Node 2 Gateway (90 deg neighbors)
 * Node 3 > Node 1 Gateway (90 deg neighbors)
 *
 *        Node 1
 *      /   |   \
 * Node 0---|---Node 2
 *          |     /
 *        Node 3
 *       /
 *  Node 4
 *
 */
// const LAYOUT_ONE = {
//   '0': {
//     _id: '0',
//     relatives: {
//       '1': {
//         _id: '1',
//         expanded: 1
//       },
//       '2': {
//         _id: '2',
//         expanded: 7,
//         gateway: true
//       }
//     },
//     from: {}
//   },
//   '1': {
//     _id: '1',
//     relatives: {
//       '2': {
//         _id: '2',
//         expanded: 2
//       }
//     },
//     from: {
//       '0': {
//         angle: 45
//       },
//       '3': {
//         angle: 0,
//         gateway: true
//       }
//     }
//   },
//   '2': {
//     _id: '2',
//     relatives: {
//       '3': {
//         _id: '3',
//         expanded: 3
//       }
//     },
//     from: {
//       '1': {
//         angle: 135
//       },
//       '4': {
//         angle: 0,
//         gateway: true
//       },
//       '0': {
//         angle: 0,
//         gateway: true
//       }
//     }
//   },
//   '3': {
//     _id: '3',
//     relatives: {
//       '4': {
//         _id: '4',
//         expanded: 4
//       },
//       '1': {
//         _id: '1',
//         expanded: 8,
//         gateway: true
//       }
//     },
//     from: {
//       '2': {
//         angle: 225
//       }
//     }
//   },
//   '4': {
//     _id: '4',
//     relatives: {
//       '2': {
//         _id: '2',
//         expanded: 5,
//         gateway: true
//       }
//     },
//     from: {
//       '3': {
//         angle: 225
//       }
//     }
//   }
// }

describe('layout', () => {
  describe('nodePos', () => {
    it('should calculate location for child at 45 deg', () => {
      let result = nodePos(5, 5, 45)
      let expected = {
        x: 6,
        y: 4,
      }
      expect(result).toEqual(expected)
    })
    it('should calculate location for child at 135 deg', () => {
      let result = nodePos(5, 5, 135)
      let expected = {
        x: 6,
        y: 6,
      }
      expect(result).toEqual(expected)
    })
    it('should calculate location for child at 225 deg', () => {
      let result = nodePos(5, 5, 225)
      let expected = {
        x: 4,
        y: 6,
      }
      expect(result).toEqual(expected)
    })
    it('should calculate location for child at 315 deg', () => {
      let result = nodePos(5, 5, 315)
      let expected = {
        x: 4,
        y: 4,
      }
      expect(result).toEqual(expected)
    })
  })
  describe('availablePos', () => {
    it('should find empty quadrants around parent node', () => {
      let filledPositions = {
        '6-6': true,
        '4-4': true,
      }
      let result = availablePos(filledPositions, 5, 5)
      let expected = [45, 225]
      expect(result).toEqual(expected)
    })
  })
  describe('checkAngleIs90', () => {
    it('should return true if angle between two nodes is 90 deg', () => {
      let node1 = {
        x: 4,
        y: 5,
      }
      let node2 = {
        x: 5,
        y: 5,
      }
      let result = checkAngleIs90(node1, node2)
      expect(result).toEqual(true)
    })
    it('should return false when angle is 45', () => {
      let node1 = {
        x: 4,
        y: 5,
      }
      let node2 = {
        x: 5,
        y: 6,
      }
      let result = checkAngleIs90(node1, node2)
      expect(result).toEqual(false)
    })
  })
  describe('crossOver90Deg', () => {
    it('should return false is there is no cross over', () => {
      let positions = {
        '1-2': {
          _id: '0',
          from: {},
          relatives: {
            '1': {
              expanded: 5,
            },
          },
        },
        '2-1': {
          _id: '1',
          from: {
            '0': {
              angle: 20,
            },
          },
          relatives: {
            '2': {
              expanded: 6,
            },
          },
        },
        '2-2': {
          _id: '2',
          from: {
            '1': {
              angle: 80,
            },
          },
          relatives: {
            '3': {
              expanded: 7,
            },
          },
        },
        '2-3': {
          _id: '3',
          from: {
            '2': {
              angle: 40,
            },
            '0': {
              angle: 0,
              gateway: true,
            },
          },
        },
      }
      let result = crossOver90deg(positions, 2, 1 * GRID_SPACING.x, 2 * GRID_SPACING.y, 2 * GRID_SPACING.x, 2 * GRID_SPACING.y)
      expect(result).toEqual({
        crossover: false,
      })
    })
    it('should return true when there are crossovers', () => {
      let positions = {
        '1-2': {
          _id: '0',
          from: {

          },
          relatives: {
            '1': {
              expanded: 1,
            },
            '2': {
              expanded: 6,
            },
          },
        },
        '2-1': {
          _id: '1',
          from: {
            '0': {
              angle: 20,
            },
          },
          relatives: {
            '2': {
              expanded: 2,
            },
            '3': {
              expanded: 5,
            },
          },
        },
        '3-2': {
          _id: '2',
          from: {
            '1': {
              angle: 80,
            },
            '0': {
              angle: 0,
              gateway: true,
            },
          },
          relatives: {
            '3': {
              expanded: 4,
            },
          },
        },
        '2-3': {
          _id: '3',
          from: {
            '2': {
              angle: 40,
            },
            '0': {
              angle: 0,
              gateway: true,
            },
            '1': {
              angle: 0,
              gateway: true,
            },
          },
        },
      }
      let result = crossOver90deg(positions, 5, 2 * GRID_SPACING.x, 1 * GRID_SPACING.y, 2 * GRID_SPACING.x, 3 * GRID_SPACING.y)
      expect(result).toEqual({
        crossover: true,
        older: true,
        otherNodes: [positions['1-2'], positions['3-2']],
      })
    })
  })
  describe('adjacent', () => {
    it('should return true if adjacent', () => {
      let node1 = createNode(5, 5, true)
      let node2 = createNode(6, 6, true)
      let result = adjacent(node1, node2)
      expect(result).toEqual(true)
    })
    it('should return true if adjacent at 90 deg', () => {
      let node1 = createNode(5, 5, true)
      let node2 = createNode(5, 6, true)
      let result = adjacent(node1, node2)
      expect(result).toEqual(true)
    })
    it('should return false if not adjacent', () => {
      let node1 = createNode(5, 5, true)
      let node2 = createNode(3, 3)
      let result = adjacent(node1, node2)
      expect(result).toEqual(false)
    })
  })
  describe('findOutgoing', () => {
    it('should add expanded children', () => {
      let node = {
        relatives: {
          1: {
            _id: 1,
          },
          2: {
            _id: 2,
            expanded: 1,
          },
        },
      }
      let expected = [{
        _id: 2,
        expanded: 1,
      }]
      expect(findOutgoing(node)).toEqual(expected)
    })
    it('should node add gateways', () => {
      let node = {
        relatives: {
          1: {
            _id: 1,
            expanded: 2,
          },
          2: {
            _id: 2,
            expanded: 3,
            gateway: true,
          },
        },
      }
      let expected = [{
        _id: 1,
        expanded: 2,
      }]
      expect(findOutgoing(node)).toEqual(expected)
    })
    it('should sort nodes by expanded property', () => {
      let node = {
        relatives: {
          1: {
            _id: 1,
            expanded: 3,
          },
          2: {
            _id: 2,
            expanded: 8,
          },
        },
      }
      let expected = [{
        _id: 2,
        expanded: 8,
      }, {
        _id: 1,
        expanded: 3,
      }]
      expect(findOutgoing(node)).toEqual(expected)
    })
  })

  describe('nodeOriginallyFrom', () => {
    it('should return parent that is not a gateway', () => {
      let node = {
        from: {
          '1': {
            _id: '1',
            gateway: true,
          },
          '2': {
            _id: '2',
          },
          '3': {
            _id: '3',
            gateway: true,
          },
        },
      }
      expect(nodeOriginallyFrom(node)).toEqual('2')
    })
  })
  describe('prepareNextNodes', () => {
    it('should add angle property', () => {
      let openPositions = [45, 315]
      let outgoing = [{
        _id: '1',
      }]
      let nodes = {
        '0': {
          _id: '0',
          relatives: outgoing,
        },
        '1': {
          _id: '1',
          from: {
            '0': {
              angle: 50,
            },
          },
        },
      }
      let expected = {
        ...nodes['1'],
        angle: 45,
      }
      expect(prepareNextNodes(openPositions, outgoing, nodes)).toEqual([
        expected,
      ])
    })
    it('should add correct number of nodes', () => {
      let openPositions = [45, 315]
      let outgoing = [{
        _id: '1',
      }, {
        _id: '2',
      }, {
        _id: '3',
      }]
      let nodes = {
        '0': {
          _id: '0',
          relatives: {
            '1': {
              _id: '1',
              expanded: 0,
            },
            '2': {
              _id: '2',
              expanded: 2,
            },
            '3': {
              _id: '3',
              expanded: 3,
            },
          },
          outgoing,
        },
        '1': {
          _id: '1',
          outgoing: [],
          originallyFrom: '0',
          from: {
            '0': {
              angle: 50,
            },
          },
        },
        '2': {
          _id: '2',
          originallyFrom: '0',
          outgoing: [],
          from: {
            '0': {
              angel: 200,
            },
          },
        },
        '3': {
          _id: '3',
          originallyFrom: '0',
          outgoing: [],
          from: {
            '0': {
              angle: 215,
            },
          },
        },
      }
      let expected = [
        {
          ...nodes['2'],
          angle: 315,
        },
        {
          ...nodes['3'],
          angle: 45,
        },
      ]
      expect(prepareNextNodes(openPositions, outgoing, nodes)).toEqual(
        expected
      )
    })
  })
  it('should find first node', () => {
    let nodes = {
      '0': {
        _id: '0',
        relatives: {
          '1': {
            _id: '1',
            expanded: 0,
          },
        },
        from: {
          '1': {
            angle: 45,
          },
        },
      },
      '1': {
        _id: '1',
        relatives: {},
        from: {},
      },
    }

    let {
      layoutNodes,
    } = layout(nodes)
    expect(layoutNodes[0].x === 0 && layoutNodes[0].y === 0).toEqual(true)
  })
  it('should put relatives at preferred angle if possible', () => {
    let nodes = {
      '0': {
        _id: '0',
        relatives: {
          '1': {
            _id: '1',
            expanded: 1,
          },
          '2': {
            _id: '2',
            expanded: 2,
          },
        },
        from: {},
      },
      '1': {
        _id: '1',
        relatives: {},
        from: {
          '0': {
            angle: 45,
          },
        },
      },
      '2': {
        _id: '2',
        relatives: {},
        from: {
          '0': {
            angle: 225,
          },
        },
      },
    }

    let {
      layoutNodes,
    } = layout(nodes)

    const node1 = layoutNodes.reduce((result, node) => {
      if (node._id === '1') {
        return node
      } else {
        return result
      }
    })
    const node2 = layoutNodes.reduce((result, node) => {
      if (node._id === '2') {
        return node
      } else {
        return result
      }
    })
    expect(node1.x === GRID_SPACING.x && node1.y === -GRID_SPACING.y).toEqual(true)
    expect(node2.x === -GRID_SPACING.x && node2.y === GRID_SPACING.y).toEqual(true)
  })
  it('should create links', () => {
    let nodes = {
      '0': {
        _id: '0',
        relatives: {
          '1': {
            _id: '1',
            expanded: 1,
          },
          '2': {
            _id: '2',
            expanded: 2,
          },
        },
        from: {},
      },
      '1': {
        _id: '1',
        relatives: {},
        from: {
          '0': {
            angle: 45,
          },
        },
      },
      '2': {
        _id: '2',
        relatives: {},
        from: {
          '0': {
            angle: 225,
          },
        },
      },
    }
    let {
      links,
    } = layout(nodes)
    let link1 = links[0]
    let link2 = links[1]
    expect(link1.x1).toEqual(0)
    expect(link1.x2).toEqual(GRID_SPACING.x)
    expect(link1.y1).toEqual(0)
    expect(link1.y2).toEqual(-GRID_SPACING.y)
    expect(link2.x1).toEqual(0)
    expect(link2.x2).toEqual(-GRID_SPACING.x)
    expect(link2.y1).toEqual(0)
    expect(link2.y2).toEqual(GRID_SPACING.y)
    expect(links.length).toEqual(2)
  })
  it('should handle first node having a gateway', () => {
    // Previous implementations of selecting the first node
    // would crash in this situation

    const nodes = {
      '0': {
        _id: '0',
        relatives: {
          '1': {
            _id: '1',
            expanded: 1,
          },
        },
        from: {
          '1': {
            gateway: true,
            angle: 0,
            name: '1',
          },
        },
      },
      '1': {
        _id: '1',
        relatives: {},
        from: {
          '0': {
            angle: 45,
          },
        },
      },
    }

    expect(layout.bind(null, nodes)).toNotThrow()
  })
})
