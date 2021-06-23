import { shallow } from 'enzyme'
import expect from 'expect'
import Orbit from '../orbit'
import React from 'react'
import Child from '../child'
import Line from 'components/Line'
import {
  OrbitWrapper,
} from '../elements'

jest.mock('utils/tags', () => ({
  clusterKeyToTagPath: key => ([{
    _key: key,
    title: 'a',
  }]),
  isCluster: topic => topic._type === 'cluster',
}))

jest.mock('../../../constants', () => ({
  BRANE_NODE_ID: '0',
}))

describe('<Node><Orbit /></Node', () => {
  it('should have class if hidden', () => {
    let wrapper = shallow(<Orbit visible={false} nodes={[]} />)
    expect(wrapper.find(OrbitWrapper).hasClass('node__orbit--hidden')).toEqual(true)
  })
  it('should have circle of correct radius', () => {
    let wrapper = shallow(<Orbit radius={100} nodes={[]} />)
    expect(wrapper.find('circle').prop('r')).toEqual(100)
  })
  it('should have children nodes', () => {
    let wrapper = shallow(<Orbit nodes={[
      { _id: '0' },
      { _id: '1' },
      { _id: '2' },
      { _id: '3' },
    ]} />)
    expect(wrapper.find(Child).length).toEqual(4)
  })
  it('should have lines to gateway and collapsed children', () => {
    let wrapper = shallow(<Orbit nodes={[
      { _id: '0' },
      { _id: '1', gateway: true },
    ]} />)
    expect(wrapper.find(Line).length).toEqual(1)
  })
})
