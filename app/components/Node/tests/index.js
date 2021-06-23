import { mount, shallow } from 'enzyme'

import Center from '../center'
import Node from '../index'
import Orbit from '../orbit'
import React from 'react'

const CHILDREN = {
  '0': {
    _id: '0',
    name: 'child',
  },
}
jest.mock('utils/svg', () => ({
  wrapText: (text) => [text],
}))
jest.mock('utils/tags', () => ({
  clusterKeyToTagPath: key => ([{
    _key: key,
    title: 'a',
  }]),
  isCluster: tag => {
    return tag._type === 'cluster'
  },
}))
jest.mock('../../../constants', () => ({
  BRANE_NODE_ID: '0',
}))

describe('<Node />', () => {
  it('should be at the correct position', () => {
    let wrapper = shallow(<Node x={10} y={10} parent={{ vennIds: [] }} />)
    expect(wrapper.find('g').prop('transform')).toEqual('translate(10,10)')
  })

  it('should render Orbit', () => {
    let wrapper = shallow(<Node parent={{ vennIds: [] }} />)
    expect(wrapper.find(Orbit).length).toEqual(1)
  })
  it('should render Center', () => {
    let wrapper = shallow(<Node parent={{ vennIds: [] }} />)
    expect(wrapper.find(Center).length).toEqual(1)
  })
  it('should add class when menu is opened for node', () => {
    let wrapper = shallow(<Node menu={{ isChild: false, parentId: '0' }} parent={{ _id: '0', vennIds: [] }} />)
    expect(wrapper.find('g').prop('className')).toContain('node--highlight-center ')
  })
  it('should add class when menu is opened for child', () => {
    let wrapper = mount(<Node menu={{ isChild: true, parentId: '2', node: { _id: '0' } }} relatives={CHILDREN} parent={{ _id: '2', from: {}, vennIds: [] }} />)
    expect(wrapper.find('.node__related-node--menu-open').length).toEqual(1)
  })
  it('should add loopbacks when incoming gateway parent isn\'t also a child', () => {
    let wrapper = mount(<Node parent={{ _id: '0', from: { '2': { gateway: true } }, vennIds: [] }} />)
    expect(wrapper.find('.node__related-node').length).toEqual(1)
  })
  it('should handle no children and a parent is a gateway', () => {
    /**
     * When there are no children, parents are shown instead on the orbit
     * When a gateway is created, a new child with two properties is added
     * The node should continue showing the parents despite there now being a child
     */

    let wrapper = mount(
      <Node
        parent={{ _id: '0', from: {}, vennIds: [] }}
        relatives={{
          // Gateway child created
          '0': {
            _id: '0',
            gateway: true,
          },
        }}
        showInOrbit='all'
      />
    )

    // There will be 1 node on orbit if parents are shown
    expect(wrapper.find('.node__related-node').length).toEqual(1)
  })
})
