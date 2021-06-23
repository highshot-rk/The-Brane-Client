import React, { Component } from 'react'
import { SocialBtn } from './elements'
import fbIcon from './icons/fb.svg'
import PropTypes from 'prop-types'

export default class FbButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    isRegistration: PropTypes.bool,
  }

  render () {
    const { onClick, isRegistration } = this.props

    return (
      <SocialBtn type='FB' onClick={onClick} >
        <img src={fbIcon} />
        {
          isRegistration
            ? <div>Continue with Facebook</div>
            : <div>Login in with Facebook</div>
        }

      </SocialBtn>
    )
  }
}
