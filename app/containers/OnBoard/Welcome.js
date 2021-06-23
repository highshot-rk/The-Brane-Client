import React, { Component } from 'react'
import { Submit } from 'elements/form'
import { featureEnabled } from 'utils/features'

export default class Welcome extends Component {
  handleSubmit = () => {
    const onBoardEnabled = featureEnabled('onBoardingQuestions')

    if (onBoardEnabled) {
      this.props.onContinue()
    } else {
      this.props.later()
    }
  }

  render () {
    const { fn } = this.props

    return (
      <div className='welcome-style'>
        <div className='welcome-title'>
          <h5>Welcome {fn}</h5>
          <p className='title'>
            A universe of knowledge awaits.
            We hope you enjoy your journey.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '64px' }}>
          <Submit className='start-btn' onClick={this.handleSubmit}>LET'S START</Submit>
        </div>
      </div>
    )
  }
}
