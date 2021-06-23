import React from 'react'
import createIconComponent from './create'
import PropTypes from 'prop-types'

export default createIconComponent({
  name: 'brane',
  // eslint-disable-next-line react/prop-types
  content: ({ dark }) => (
    <path fill={dark ? '#fff' : '#2D2D2D'} d='M20 4.533l-4 6.615-4-6.615-6.934 11.467 6.934 11.466 4-6.615 4 6.615 6.933-11.466-6.934-11.467zM16.374 20.234l2.56-4.234-2.56-4.234 3.626-5.997 6.186 10.231-6.186 10.231-3.626-5.997zM5.814 16l6.186-10.231 3.626 5.997-2.56 4.234 2.56 4.234-3.626 5.997-6.186-10.231zM13.814 16l2.186-3.616 2.186 3.616-2.186 3.616-2.186-3.616z' />
  ),
  contentProps: {
    dark: PropTypes.bool,
  },
})
