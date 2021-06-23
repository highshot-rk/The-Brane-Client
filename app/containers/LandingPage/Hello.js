import React, { Component } from 'react'
import { LoginContainer, SocialBtn, SignUp, WindowWrapper, ContentRight } from './elements'
import FbButton from './FbButton'
import InButton from './InButton'
import GoAuth from './GoButton'
import { Link } from 'react-router-dom'
import { featureEnabled } from 'utils/features'
import { connect } from 'react-redux'
import { clearAuthErrorRegister, clearAuthErrorLogin } from 'containers/Auth/reducer'
class HelloForm extends Component {
  constructor (props) {
    super(props)
    this.props.clearAuthErrorLogin()
    this.props.clearAuthErrorRegister()
  }
  render () {
    return (
      <ContentRight className='content-right-height'>
        <WindowWrapper>
          <div className='login-container'>
            <SignUp className='signup-end'>
              <p>
                Don't have an account? <Link className='linkText' to='/join'>Sign up here.</Link>
              </p>
            </SignUp>
            <LoginContainer className='mobile-height'>
              {
                featureEnabled('socialLogin') && (
                  <>
                    <InButton />
                    <FbButton />
                    <GoAuth />
                    <hr data-content='or' />
                  </>
                )
              }<div className='login-width'>
                <h6 className='h6-style'>Join The Brane Now</h6>
                <h5>Organising humanity's knowledge</h5>
                <Link style={{ textDecoration: 'none' }} to='/join'><SocialBtn>
                  SIGN UP
                </SocialBtn></Link>
                <Link style={{ textDecoration: 'none' }} to='/log-in'><SocialBtn className='login-style'>
                  LOG IN
                </SocialBtn></Link><br /><br /></div>
            </LoginContainer>
          </div>
        </WindowWrapper>
      </ContentRight>
    )
  }
}

const mapDispatchToProps = {
  clearAuthErrorLogin,
  clearAuthErrorRegister,
}

const Hello = connect(null, mapDispatchToProps)(
  HelloForm
)

export default Hello
