import React, { Component } from 'react'
import { ActivateAcountContainer, SocialBtn, WindowWrapper, ContentRight } from './elements'
import { Link } from 'react-router-dom'
import { logout } from 'containers/Auth/reducer'
import { connect } from 'react-redux'
import Computers from './icons/computers.svg'

class ErrorPage extends Component {
  componentDidMount () {
    // A user is sent to this page when they try to log into the web client on a mobile device
    // When they are re directed to this page they are automatically logged out from the client

    this.props.logout()
  }
  render () {
    return (
      <ContentRight className='content-right-height'>
        <WindowWrapper>
          <ActivateAcountContainer>
            <div className='error-style'>
              <img src={Computers} alt='' className='computer-svg' width='345' height='90' />
              <h6>The Brane is not on mobile yet</h6>
              <p className='p-style2'>
                Effective sense-making on complex systems requires a minimum screen size.
              </p>
              <p className='p-style2'>
                The Brane experience is currently designed to take advantage of a full computer screen. Please come back whenever
                you have access to a computer.
              </p>
              <Link className='continue' to='/hello'><SocialBtn className='btn-style'>Log out</SocialBtn></Link>
            </div>
          </ActivateAcountContainer>
        </WindowWrapper>
      </ContentRight>
    )
  }
}

const mapDispatchToProps = {
  logout,
}

const Error = connect(null, mapDispatchToProps)(
  ErrorPage
)

export default Error
