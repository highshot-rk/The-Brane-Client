import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { verifyToken, loginTest } from 'containers/Auth/reducer'
import { connect } from 'react-redux'
import { ActivateAcountContainer, SocialBtn, WindowWrapper, ContentRight } from './elements'
import { LinearProgress } from 'material-ui-core'
import { withStyles } from 'material-ui-core/styles'
import { selectAuthenticating, selectAuth } from 'containers/Auth/selectors'
import { createStructuredSelector } from 'reselect'
// TODO: FIX RENDER ERRORS
const CustomLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#fff',
  },
  barColorPrimary: {
    backgroundColor: '#0ED89B',
  },
})(LinearProgress)

class VerifyUserPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmed: false,
      errorMessage: '',
    }
  }

  async componentDidMount () {
    const token = this.props.data.match.params.token
    const verify = await this.props.verifyToken(token)
    if (verify.verify) {
      this.setState({
        confirmed: true,
      })
    } else {
      this.setState({
        confirmed: false,
        errorMessage: verify.data,
      })
    }
  }

  handleSubmit = () => {
    window.location.reload()
    this.props.data.history.push('/welcome')
  }

  render () {
    return (
      <ContentRight className='content-right-height'>
        <WindowWrapper>
          <ActivateAcountContainer>
            {this.props.authenticating ? <div> <h5>Verifying your email, please wait</h5> <br />
              <CustomLinearProgress /></div> : this.state.confirmed
              ? <div className='verify-style'>
                <h5>Success!</h5>
                <h6>Your email has been verified</h6>
                <SocialBtn className='login-style' onClick={this.handleSubmit}>Continue</SocialBtn>
              </div> : <div><h5>Oops</h5>
                <h6>{this.state.errorMessage}</h6>
                <Link className='continue' to='/log-in'><SocialBtn className='btn-style' onClick={this.handleSubmit}>Continue</SocialBtn></Link></div>}
          </ActivateAcountContainer>
        </WindowWrapper>
      </ContentRight>
    )
  }
}

const mapDispatchToProps = {
  verifyToken,
  loginTest,
}

const structuredSelector = createStructuredSelector({
  authenticating: selectAuthenticating,
  auth: selectAuth,
})

const VerifyUser = connect(structuredSelector, mapDispatchToProps)(
  VerifyUserPage
)

export default VerifyUser
