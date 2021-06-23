import React from 'react'
import createIconComponent from './create'

export default createIconComponent({
  name: 'close',
  content: () => (
    <path d='M16 16l80 80zm0 80l80-80z' stroke='#fff' strokeWidth='14' />
  ),
  viewBox: '-30 -40 190 190',
})
