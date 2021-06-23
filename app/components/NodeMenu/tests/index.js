import NodeMenu from '../'
import React from 'react'
import expect from 'expect'
import { shallow } from 'enzyme'

jest.mock('../../../constants', () => ({
  BRANE_NODE_ID: '0',
}))

describe('<NodeMenu />', () => {
  it.skip('should have correct position', () => {
    let wrapper = shallow(<NodeMenu node={{}} parentNode={{ _id: '5' }} x={5} y={5} exploreNode={() => {}} collapseBranch={() => {}} toggleOrbitLock={() => {}} showBranchPipeline={() => {}} expandBranch={() => {}} />)
    expect(wrapper.find('g > g').prop('transform')).toEqual('translate(5, 5)')
  })
})
