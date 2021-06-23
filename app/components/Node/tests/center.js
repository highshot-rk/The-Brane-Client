import { Center } from '../center'
import { shallow, mount } from 'enzyme'
import expect from 'expect'
import React from 'react'
import Icon from 'components/Icon'

jest.mock('utils/svg', () => ({
  // simulate multiple lines
  wrapText: (text) => [text.split(' ')[0], text.split(' ').slice(1).join(' ')],
}))
jest.mock('../../../constants', () => ({
  BRANE_NODE_ID: '0',
}))

describe('<Node> <Center /> </Node>', () => {
  it('should display circle with correct scale', () => {
    let wrapper = shallow(<Center radius={50} />)
    wrapper.setState({
      firstRender: false,
    })
    expect(wrapper.find('circle').prop('style').transform).toEqual('scale(0.5, 0.5)')
  })
  it('should show The Brane logo', () => {
    let wrapper = shallow(<Center text='The Brane' parent={{ totalNodes: 5, _id: '0' }} />)
    expect(wrapper.find(Icon).length).toEqual(1)
  })
  // TODO: Fix using d3, svg, and jsdom together
  it('should wrap node name', () => {
    let wrapper = mount(<Center text='A very, very long name' radius={50} />)
    expect(wrapper.find('text tspan').length).toEqual(2)
  })
  it('should display node count', () => {
    let wrapper = shallow(<Center nodeCount={10} />)
    expect(wrapper.find('.node__center__node-count').text()).toEqual('10')
  })
})
