import React from 'react'
import { storiesOf } from '@storybook/react'
import Child from 'components/Node/child'
import PropTypes from 'prop-types'

const Wrapper = ({ children }) => <svg><g transform='translate(100, 100)' className='node'>{children}</g></svg>
Wrapper.propTypes = {
  children: PropTypes.element,
}

storiesOf('Child', module)
  .add('default', () => (
    <Wrapper>
      <Child
        parentTitle='Gravity'
        x={0}
        y={0}
        node={{ title: 'motion' }}
        side={'left'}
        maxTitleLength={40}
      />
    </Wrapper>
  ))
  .add('shorten title', () => (
    <Wrapper>
      <Child
        parentTitle='Gravity'
        x={0}
        y={0}
        node={{ title: 'Theories (test) (Gravity)' }}
        side={'right'}
        maxTitleLength={10}
      />
    </Wrapper>
  ))
  .add('single property', () => (
    <Wrapper>
      <Child
        parentTitle='Gravity'
        x={100}
        y={0}
        node={{ title: 'motion' }}
        side={'left'}
        maxTitleLength={40}
        properties={[{ _id: '0', value: 5, color: '#50d550', symbol: '%' }]}
      />
    </Wrapper>
  ))
  .add('multiple properties', () => (
    <Wrapper>
      <Child
        parentTitle='Gravity'
        x={100}
        y={0}
        node={{ title: 'motion' }}
        side={'left'}
        maxTitleLength={40}
        properties={[{ _id: '0', value: 5, color: '#50d550', symbol: '%' }, { _id: '0', value: 2000, color: '#FF78CB', symbol: '$' }]}
      />
    </Wrapper>
  ))
  .add('multiple properties right', () => (
    <Wrapper>
      <Child
        parentTitle='Gravity'
        x={0}
        y={0}
        node={{ title: 'motion' }}
        side={'right'}
        maxTitleLength={40}
        properties={[{ _id: '0', value: 5, color: '#50d550', symbol: '%' }, { _id: '0', value: 2000, color: '#FF78CB', symbol: '$' }]}
      />
    </Wrapper>
  ))
