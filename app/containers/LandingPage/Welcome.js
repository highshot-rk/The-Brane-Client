import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  WelcomeContent,
  TextButton,
} from './elements'

export default class Welcome extends Component {
  static propTypes = {
    onboardingFinished: PropTypes.func,
    showTheBrane: PropTypes.func,
  }
  continue = () => {
    this.props.onboardingFinished()
    this.props.showTheBrane()
  }
  render () {
    return (
      <WelcomeContent>
        <h1>Thanks for signing up.</h1>
        <h1>
          A universe of knowledge awaits.<br />
          We hope you enjoy your journey.
        </h1>
        <TextButton onClick={this.continue}>
          Continue to The Brane
        </TextButton>
      </WelcomeContent>
    )
  }
}
