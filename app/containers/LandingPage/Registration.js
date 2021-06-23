import React, { Component } from 'react'
import { SocialBtn, RegistrationContainer, SignUp, WindowWrapper, ContentRight } from './elements'
import { connect } from 'react-redux'
import EmailRegistrationForm from './EmailRegistrationForm'
import RegistrationOptions from './RegistrationOptions'
import { validateEmail } from 'utils/formInputs'
import { register, clearAuthErrorLogin } from 'containers/Auth/reducer'
import { selectLoggedIn, selectAuthErrorRegister, selectIsRegistered, selectNewEmail, selectAuthenticating } from 'containers/Auth/selectors'
import { createStructuredSelector } from 'reselect'
import { featureEnabled } from 'utils/features'
import { Link } from 'react-router-dom'
import { LinearProgress } from 'material-ui-core'
import { withStyles } from 'material-ui-core/styles'

const CustomLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#fff',
  },
  barColorPrimary: {
    backgroundColor: '#0ED89B',
  },
})(LinearProgress)

class Signup extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      inputError: null,
      checkboxError: null,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      showEmailForm: !featureEnabled('socialLogin'),
      newsletter: false,
      attemptedRegistration: false,
      receiveUpdates: false,
      checkBoxTicked: false,
      showAuthError: true,
    }
    this.state = this.initialState
    this.props.clearAuthErrorLogin()
  }

  validateInputsLength = () => {
    const { firstName, lastName, email, password, passwordConfirmation } = this.state
    let valid = true
    const inputs = {
      'Confirm Password': passwordConfirmation,
      'Password': password,
      'Email Address': email,
      'Last Name': lastName,
      'First Name': firstName,
    }
    Object.keys(inputs).map(prop => {
      if (prop === 'Password' && inputs[prop].length <= 7) {
        this.setState({
          inputError: `The password length must be at least 8 characters long`,
          showAuthError: true,
        })
        valid = false
        return
      }
      if (inputs[prop].length <= 0) {
        this.setState({
          inputError: `The field ${prop} is required to continue`,
          showAuthError: true,
        })
        valid = false
      }
    })
    return valid
  }

  async handleSubmit () {
    if (this.validateInputsLength()) {
      const { firstName, lastName, email, password, passwordConfirmation, receiveUpdates } = this.state
      if (validateEmail(email) && this.state.checkBoxTicked) {
        await this.props.register({
          email: email,
          password,
          passwordConfirmation,
          firstName: firstName,
          lastName: lastName,
          getEmails: receiveUpdates,
        })
        this.setState({
          showAuthError: true,
        })
      } else if (!this.state.checkBoxTicked) {
        this.setState({
          checkboxError: `You must agree with our terms of service, privacy policy and cookie policy.`,
          showAuthError: true,
        })
      } else {
        this.setState({
          inputError: `Enter a valid email address`,
          showAuthError: true,
        })
      }
    }
  }

  onInputChange = ({ target: { name, value } }) => this.setState({ [name]: value, inputError: null, showAuthError: false })

  onCheckChange = (e) => this.setState({ newsletter: e.target.checked })

  onMailClick = () => this.setState({ showEmailForm: true })

  handleInputChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }

  handleClick = () => {
    this.setState({
      checkboxError: null,
      checkBoxTicked: !this.state.checkBoxTicked,
      showAuthError: false,
    })
  }

  handleEmailClick = () => {
    this.setState({
      receiveUpdates: !this.state.receiveUpdates,
    })
  }

  render () {
    const { attemptedRegistration, showEmailForm, newsletter, firstName, lastName, email, password, passwordConfirmation, inputError, checkboxError, showAuthError } = this.state
    const { authError, authenticating } = this.props
    let displayedError = inputError || checkboxError
    return (
      <ContentRight className='content-right-height'>
        <WindowWrapper>
          <div className='login-container'>
            <SignUp className='signup-end'>
              <p>
                Already have an account? <Link className='linkText' to='/log-in'>Log in here.</Link>
              </p>
            </SignUp>
            <RegistrationContainer>
              {!authenticating ? <div>
                <h5 className='h5-style'>Organising humanity's knowledge</h5>
                <h6 className='h6-style'>Join now</h6>
                {!showEmailForm
                  ? <RegistrationOptions onMailClick={this.onMailClick} />
                  : <EmailRegistrationForm
                    onInputChange={this.onInputChange}
                    onCheckChange={this.onCheckChange}
                    newsletter={newsletter}
                    firstName={firstName}
                    lastName={lastName}
                    email={email}
                    password={password}
                    passwordConfirmation={passwordConfirmation}
                    attemptedRegistration={attemptedRegistration}
                  />
                }
                <label className='container container-top'>I want to receive communications and updates from The Brane's team
                  <input type='checkbox' name='checkbox-one' checked={this.state.receiveUpdates} onChange={this.handleEmailClick} />
                  <span type='checkbox' className='checkmark' />
                </label>

                <label className='container container-bottom'>
                  By registering, I agree with &nbsp;<a className='a-style' href='https://docs.google.com/document/d/1eoG7wTLSx-V__PG9C1oeg1klARYdiOma1RPpNJrG_w0/edit' >The Brane's terms of service</a>,&nbsp;<a className='a-style' href='https://docs.google.com/document/d/1XBZ1i2HfLV3MKGOV0ycfG0hVM6AC8w5ZLeu9h3-dRNo/edit'>privacy policy</a>
                &nbsp;and&nbsp;<a className='a-style' href='https://docs.google.com/document/d/1BqLgIdUDbHeMsHXBHNswH7UnE2NuXLpMaFzUHGpHT3k/edit'>cookie policy</a>
                  <input type='checkbox' name='checkbox-two' checked={this.state.checkBoxTicked} onChange={this.handleClick} />
                  <span className='checkmark' />
                </label>
                {<p className='submitError'>{showAuthError && (displayedError || authError)}</p>}
                {(showAuthError && (displayedError || authError)) ? <SocialBtn className='login-error' onClick={this.handleSubmit}>CREATE ACCOUNT</SocialBtn> : <SocialBtn className='register' onClick={() => this.handleSubmit()}>CREATE ACCOUNT</SocialBtn>}
              </div> : <div>
                <h5 className='h5-style'>REGISTERING...</h5>
                <CustomLinearProgress />
              </div>}
            </RegistrationContainer>
          </div>
        </WindowWrapper>
      </ContentRight>
    )
  }
}
const mapDispatchToProps = {
  register,
  clearAuthErrorLogin,
}

const structuredSelector = createStructuredSelector({
  loggedIn: selectLoggedIn,
  authError: selectAuthErrorRegister,
  isRegistered: selectIsRegistered,
  newEmail: selectNewEmail,
  authenticating: selectAuthenticating,
})

const SignupPage = connect(structuredSelector, mapDispatchToProps)(
  Signup
)

export default SignupPage
