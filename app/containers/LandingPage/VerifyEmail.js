import React, { Component } from 'react'
import { ActivateAcountContainer, SocialBtn, WindowWrapper, ContentRight } from './elements'
import { Link } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { logout, emailResend } from 'containers/Auth/reducer'
import { selectEmailConfirmed, selectOnboardingStarted, selectAuth } from 'containers/Auth/selectors'
import { connect } from 'react-redux'

class VerifyEmailPage extends Component {
  resendEmail = () => {
    const email = this.props.auth.authToken.user.email
    this.props.emailResend(email)
  }

  render () {
    const {
      auth,
    } = this.props
    const email = auth.authToken.user.email
    return (
      <ContentRight className='content-right-height'>
        <WindowWrapper>
          <ActivateAcountContainer><div className='verify-style'>
            <h5>Oragnising humanity's knowledge</h5>
            <h6>Activate your account</h6>
            <p className='p-style'>
              Please click on the activation link we’ve sent to your email inbox at
            </p>
            <a className='a-colour'>{email}</a>
            <Link className='continue'><SocialBtn className='btn-style' onClick={this.resendEmail}>Resend Activation Email</SocialBtn></Link>
          </div>
          </ActivateAcountContainer>
        </WindowWrapper>
      </ContentRight>
    )
  }
}

const mapDispatchToProps = {
  logout,
  emailResend,
}

const structuredSelector = createStructuredSelector({
  emailConfirmed: selectEmailConfirmed,
  onBoardingStarted: selectOnboardingStarted,
  auth: selectAuth,
})

const VerifyEmail = connect(structuredSelector, mapDispatchToProps)(
  VerifyEmailPage
)

export default VerifyEmail
