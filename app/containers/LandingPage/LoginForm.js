import React, { Component } from 'react'
import { LoginContainer, SocialBtn, IconInput, SignUp, WindowWrapper, ContentRight } from './elements'
import { connect } from 'react-redux'
import mailIcon from './icons/mail.svg'
import lockIcon from './icons/locked.svg'
import FbButton from './FbButton'
import InButton from './InButton'
import GoAuth from './GoButton'
import { validateEmail } from 'utils/formInputs'
import { Link } from 'react-router-dom'
import { featureEnabled } from 'utils/features'
import { login, clearAuthErrorRegister } from 'containers/Auth/reducer'
import { createStructuredSelector } from 'reselect'
import { selectAuthErrorLogin, selectAuth, selectAuthenticating } from 'containers/Auth/selectors'
import { LinearProgress } from 'material-ui-core'
import { withStyles } from 'material-ui-core/styles'
import { selectLoggedIn } from '../Auth/selectors'

const CustomLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#fff',
  },
  barColorPrimary: {
    backgroundColor: '#0ED89B',
  },
})(LinearProgress)

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      error: '',
      email: '',
      password: '',
      emailValid: true,
      passwordValid: true,
      showAuthError: true,
    }
    this.state = this.initialState
    this.props.clearAuthErrorRegister()
  }

  handleSubmit = async () => {
    const { email, password } = this.state

    if (!email) {
      this.setState({
        error: 'Enter a valid email address',
        emailValid: false,
        showAuthError: true,
      })
    } else if (!password) {
      this.setState({
        error: 'Enter a password',
        passwordValid: false,
        showAuthError: true,
      })
    }

    if (validateEmail(email.toLowerCase())) {
      if (password.length > 0) {
        await this.props.login({
          email: email.toLowerCase(),
          password,
        })
        this.setState({
          error: '',
          showAuthError: true,
        })
      } else {
        this.setState({
          error: 'Enter a password',
          passwordValid: false,
        })
      }
    } else {
      this.setState({
        error: 'Enter a valid email address',
        emailValid: false,
      })
    }
  }

  handleEmailOnChange = ({ target: { value } }) => {
    this.setState({
      error: '',
      email: value,
      emailValid: validateEmail(value),
      showAuthError: false,
    })
  }

  handleOnPasswordChange = ({ target: { value } }) => {
    this.setState({
      error: '',
      password: value,
      passwordValid: value.length > 0,
      showAuthError: false,
    })
  }

  render () {
    const { email, password, emailValid, error, passwordValid, showAuthError } = this.state
    const { authenticating } = this.props
    return (
      <ContentRight className='content-right-height'>
        <WindowWrapper>
          <div className='login-container'>
            <SignUp className='signup-end'>
              <p>
                Don't have an account? <Link className='linkText' to='/join'>Sign up here.</Link>
              </p>
            </SignUp>
            <LoginContainer className='true'>
              {
                featureEnabled('socialLogin') && (
                  <>
                    <InButton />
                    <FbButton />
                    <GoAuth />
                    <hr data-content='or' />
                  </>
                )
              }
              {authenticating ? <div><h5>Logging in...</h5><CustomLinearProgress /></div>
                : <div className='layout-column'>
                  <h5 className='h5-login'>Organising humanity's knowledge</h5>
                  <h6>Welcome back</h6>
                  <div className='layout-column'>
                    <label style={{ marginTop: '16px' }} htmlFor='emailAddress'>
                      Email
                    </label>
                    <IconInput
                      name='emailAddress'
                      valid={emailValid}
                      icon={mailIcon}
                      onChange={this.handleEmailOnChange}
                      value={email}
                      type='email'
                      placeholder='Email Address' />
                  </div>
                  <div className='layout-column'>
                    <label htmlFor='password'>
                      Password
                    </label>
                    <IconInput
                      name='password'
                      valid={passwordValid}
                      icon={lockIcon}
                      onChange={this.handleOnPasswordChange}
                      value={password}
                      placeholder='Password'
                      type='password' />
                  </div>
                  {<p className='submitError'>{showAuthError && (error || this.props.authError)}</p>}
                  {(showAuthError && this.props.authError) ? <SocialBtn className='login-error social-margin' onClick={this.handleSubmit}>
                    LOG IN
                  </SocialBtn> : <SocialBtn className='social-margin' onClick={this.handleSubmit}>
                    LOG IN
                  </SocialBtn>}
                </div>
              }
            </LoginContainer>
          </div>
        </WindowWrapper>
      </ContentRight>
    )
  }
}

const mapDispatchToProps = {
  login,
  clearAuthErrorRegister,
}

const structuredSelector = createStructuredSelector({
  auth: selectAuth,
  authError: selectAuthErrorLogin,
  authenticating: selectAuthenticating,
  loggedIn: selectLoggedIn,
})

const Login = connect(structuredSelector, mapDispatchToProps)(
  LoginForm
)

export default Login
