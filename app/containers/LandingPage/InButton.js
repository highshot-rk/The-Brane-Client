import React, { Component } from 'react'
import linkedinIcon from './icons/linkedin.svg'
import { SocialBtn } from './elements'
import PropTypes from 'prop-types'

export default class InButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    isRegistration: PropTypes.bool,
  }

  render () {
    const { onClick, isRegistration } = this.props

    return (
      <SocialBtn type='LIN' onClick={onClick} >
        <img src={linkedinIcon} alt='' />
        {
          isRegistration
            ? <div>Continue with LinkedIn</div>
            : <div>Log in with LinkedIn</div>
        }
      </SocialBtn>
    )
  }
}
