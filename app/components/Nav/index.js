import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  NavWrapper,
  Brand,
} from './elements'
import { Link } from 'react-router-dom'

export default class Nav extends Component {
  render () {
    return <NavWrapper hideLinks={this.props.hideLinks}>
      <a href='https://www.thebrane.com/'>
        <svg viewBox='0 0 32 32' width='42' height='42'>
          <path fill='#fffff' d='M20 4.533l-4 6.615-4-6.615-6.934 11.467 6.934 11.466 4-6.615 4 6.615 6.933-11.466-6.934-11.467zM16.374 20.234l2.56-4.234-2.56-4.234 3.626-5.997 6.186 10.231-6.186 10.231-3.626-5.997zM5.814 16l6.186-10.231 3.626 5.997-2.56 4.234 2.56 4.234-3.626 5.997-6.186-10.231zM13.814 16l2.186-3.616 2.186 3.616-2.186 3.616-2.186-3.616z' />
        </svg>
      </a>
      <Brand>
        The Brane
      </Brand>
      <a href='https://www.thebrane.com/private-graph'>The Platform</a>
      <a href='https://www.thebrane.com/our-mission'>Our Mission</a>
      <Link to='/log-in'>Log in</Link>
      <Link to='/join' className='join'>Join</Link>
    </NavWrapper>
  }
}

Nav.propTypes = {
  hideLinks: PropTypes.bool,
}
