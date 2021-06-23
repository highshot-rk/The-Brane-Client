import React from 'react'
import {
  ParentChildToggle,
} from './elements'

export default function ({ isParent, onDirectionChange }) {
  return (
    <ParentChildToggle onClick={() => onDirectionChange(!isParent)}>
      <span className='label'>{isParent ? 'Parent' : 'Child'}</span>
      <span>
        &#8644;
      </span>
      <span className='label'>{isParent ? 'Child' : 'Parent'}</span>
    </ParentChildToggle>
  )
}
