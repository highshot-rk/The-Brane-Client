
import React from 'react'
import createIconComponent from './create'

export default createIconComponent({
  name: 'property',
  content: () => (
    <path
      d='M0 9h2.93l7.57 3.857L18.07 9H21l-10.5 5.143L0 9zm0-3.858L10.5 0 21 5.142l-10.5 5.144L0 5.142zm10.5-3.858L2.625 5 10.5 9l7.875-4.001L10.5 1.284zm0 15.43l7.57-3.857H21L10.5 18 0 12.857h2.93l7.57 3.857z'
      fillRule='evenodd'
    />
  ),
  viewBox: '0 0 24 24',
})
