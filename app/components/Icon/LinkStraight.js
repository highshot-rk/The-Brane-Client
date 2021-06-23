import React from 'react'
import createIconComponent from './create'

export default createIconComponent({
  name: 'link-straight',
  // eslint-disable-next-line react/prop-types
  content: () => (
    <g transform='rotate(-45 14.06776644 5.37193263)' stroke='#2E2E2E' fill='none' fillRule='evenodd'>
      <circle cx='2.5' cy='2.5' r='2.5' />
      <circle cx='14.5' cy='2.5' r='2.5' />
      <path d='M5.23147578 2.86666667h6.53258412' strokeLinecap='square' />
    </g>
  ),
  viewBox: '0 0 16 16',
})
