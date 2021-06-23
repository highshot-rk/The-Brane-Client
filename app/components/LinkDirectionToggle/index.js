import PropTypes from 'prop-types'
import React from 'react'
import {
  Wrapper,
} from './elements'

export default function ParentChildToggle ({ isParent, onDirectionChange, oneDirection }) {
  return (
    <Wrapper onClick={() => onDirectionChange(!isParent)}>
      <span className='label'>{isParent ? 'Parent' : 'Child'}</span>
      {oneDirection
        ? <span>&rarr;</span>
        : <span>&#8644;</span>
      }
      <span className='label'>{isParent ? 'Child' : 'Parent'}</span>
    </Wrapper>
  )
}

ParentChildToggle.propTypes = {
  isParent: PropTypes.bool,
  oneDirection: PropTypes.bool,
  onDirectionChange: PropTypes.func,
}

ParentChildToggle.defaultProps = {
  onDirectionChange: () => {},
}
