import React from 'react'
import PropTypes from 'prop-types'

export const Dots = ({ color = '#FFF' }) => (
  <svg width='3' height='19' xmlns='http://www.w3.org/2000/svg'>
    <path d='M1.47 18.605a1.35 1.35 0 1 0-.095-2.698 1.35 1.35 0 0 0 .095 2.698zm.027-7.806a1.35 1.35 0 1 0-.094-2.698 1.35 1.35 0 0 0 .094 2.698zm.028-7.806A1.35 1.35 0 1 0 1.43.295a1.35 1.35 0 0 0 .095 2.698z' fill={color} fillRule='evenodd' />
  </svg>
)

Dots.propTypes = {
  color: PropTypes.string,
}
