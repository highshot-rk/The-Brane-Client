import React, { Component } from 'react'
import { Submit } from 'elements/form'
import { FinishContainer } from './elements'

export default class Mission extends Component {
  render () {
    const { onContinue, fn, later } = this.props
    return (
      <div className='question-container'>
        <div className='mission-content'>
          <div className='mission-style'>
            <h5>Welcome {fn}</h5>
            <p className='test'>Our mission is to unify knowledge in service of humanity and nature,<br />to effect worldwide systems change and build a
              <strong> more equitable society.</strong>
            </p>
            <p className='test'>We believe you have the talents and skills to connect the dots and<br /><strong>solve pressing global challenges.</strong>
            </p>
            <p className='test'>By answering the following questions, <strong>you agree to be a part of our Sense-Making Community Graph</strong>, to be discoverable
              by other members of the Sense-Making Community Graph to find others based on
              their skills, organistations, projects  and locations - Don't worry: You can opt out of this graph at any time.
            </p>
            <div className='form-btn'>
              <Submit onClick={onContinue} className='btn-style'>YES, LET'S CONNECT THE DOTS</Submit>
            </div>
          </div>
        </div>
        <FinishContainer>
          <a onClick={later} className='link-style'><p className='finish-later'>I will finish this later, continue to The Brane</p></a>
        </FinishContainer>
      </div>
    )
  }
}
