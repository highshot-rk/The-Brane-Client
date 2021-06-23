import React from 'react'
import PropTypes from 'prop-types'

export const Vote = function (props) {
  return (
    <svg
      width='22px'
      height='55px'
      viewBox='0 0 22 50'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'>
      <g transform='translate(0.000000, 3.000000)'>
        <g
          id='upvote'
          style={{ cursor: 'pointer' }}
          fill='#6ce4bb'
          onClick={props.upvote}
          transform='translate(11.969031, 8.344820) rotate(-180.000000) translate(-11.969031, -8.344820) translate(0.969031, 0.844820)'>
          <path
            d='M4.6566241,18.361401 C4.21622639,18.6876215 3.85921351,18.5131621 3.85921351,17.9508568 L3.85921351,-2.01942866 C3.85921351,-2.57238651 4.22583907,-2.74907292 4.6566241,-2.4299729 L17.8933909,7.37503955 C18.3337886,7.70126007 18.3241759,8.23728855 17.8933909,8.55638857 L4.6566241,18.361401 Z'
            transform='translate(10.834087, 7.966615) rotate(-270.000000) translate(-10.834087, -7.966615) ' />
        </g>
        <text x='3' y='30' fill='#979797'>{20}</text>

        <g id='downvote' fill='#979797' style={{ cursor: 'pointer' }} transform='translate(1.000000, 33.875789)'>
          <path
            onClick={props.downvote}
            d='M4.6566241,18.361401 C4.21622639,18.6876215 3.85921351,18.5131621 3.85921351,17.9508568 L3.85921351,-2.01942866 C3.85921351,-2.57238651 4.22583907,-2.74907292 4.6566241,-2.4299729 L17.8933909,7.37503955 C18.3337886,7.70126007 18.3241759,8.23728855 17.8933909,8.55638857 L4.6566241,18.361401 Z'
            transform='translate(10.834087, 7.966615) rotate(-270.000000) translate(-10.834087, -7.966615) ' />
        </g>
      </g>
    </svg>
  )
}

Vote.propTypes = {
  downvote: PropTypes.func,
  upvote: PropTypes.func,
}

export const ConfidenceInfoIcon = ({ color, onClick }) => (
  <svg style={{ cursor: 'pointer' }} onClick={onClick} xmlns='http://www.w3.org/2000/svg' width='15' height='15'>
    <g>
      <circle cx='6' cy='7' r='5' fill='none' stroke={color} strokeWidth='1' />
      <text x='6' y='9' fontSize='7' color={color} fontFamily='Times New Roman, Times, serif'
        textAnchor='middle' fontWeight='600' fontStyle='italic'>
        i
      </text>
    </g>
  </svg>
)

ConfidenceInfoIcon.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
}
