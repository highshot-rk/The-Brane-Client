import React, { Component } from 'react'
import googleIcon from './icons/google.svg'
import { SocialBtn } from './elements'
import PropTypes from 'prop-types'

export default class GOButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    isRegistration: PropTypes.bool,
  }

  render () {
    const { onClick, isRegistration } = this.props

    return (
      <SocialBtn type='GO' onClick={onClick} >
        <img src={googleIcon} />
        {
          isRegistration
            ? <div>Continue with Google</div>
            : <div>Log in with Google</div>
        }
      </SocialBtn>
    )
  }
}
