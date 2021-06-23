import React from 'react'
import createIconComponent from './create'
import PropTypes from 'prop-types'

function createTransform (direction) {
  switch (direction) {
    case 'left':
      return ''
    case 'right':
      return 'rotate(180deg)'
    case 'top':
      return 'rotate(90deg)'
    default:
      console.warn('Unknown icon direction')
      return ''
  }
}

export default createIconComponent({
  name: 'arrow',
  // eslint-disable-next-line react/prop-types
  content: ({ direction = 'left' }) => (
    <g style={{ transform: createTransform(direction), transformOrigin: '50% 50%' }}>
      <path d='M13.891 17.418c0.268 0.272 0.268 0.709 0 0.979s-0.701 0.271-0.969 0l-7.83-7.908c-0.268-0.27-0.268-0.707 0-0.979l7.83-7.908c0.268-0.27 0.701-0.27 0.969 0s0.268 0.709 0 0.979l-7.141 7.419 7.141 7.418z' />
    </g>
  ),
  viewBox: '0 0 20 20',
  contentProps: {
    direction: PropTypes.oneOf([
      'left',
      'right',
      'top',
      'bottom',
    ]),
  },
})
