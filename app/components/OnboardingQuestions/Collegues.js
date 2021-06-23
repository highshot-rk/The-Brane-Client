import React, { Component } from 'react'
import { InputRow, Submit } from 'elements/form'
import { FinishContainer } from '../../containers/OnBoard/elements'
import { InputTag } from 'components/InputTag'
import { QuestionContainer, QuestionForm } from './elements'

export default class Collegues extends Component {
  state = {
    error: null,
  }

  onClick = () => {
    if (this.props.colleagues.length < 5) {
      this.setState({
        error: 'Please enter a minimum of 5 colleagues',
      })
    } else {
      this.props.onContinue()
    }
  }
  render () {
    const { onContinue, onPrevious, colleagues, onChange, addTag, later } = this.props
    return (
      <QuestionContainer>
        <QuestionForm className='alt-styling'>
          <div className='q-width2 q-width3'>
            <a onClick={onPrevious} className='navigation'>Previous</a>
            <h5>Question 8 of 8</h5>
            <p className='title'>
              Who are your most important colleagues?<br />
              Please type the names of between<br />
              5 and 10 colleagues, or enter their emails.</p>
          </div>
          <div className='q-width'>
            <InputRow className='input-style'>
              <p className='input-label'>Type the name or email of your collaborators</p>
              <InputTag tags={colleagues} removeTag={onChange} addTag={addTag} />
              {this.state.error && <p className='question-error'>{this.state.error}</p>}
            </InputRow>
            <div className='q-btn'>
              <div>
                <a className='navigation' onClick={onContinue}>Skip the question</a>
              </div>
              <Submit className='btn-submit' onClick={this.onClick}>NEXT</Submit>
            </div>
          </div>
        </QuestionForm>
        <FinishContainer>
          <a onClick={later} className='link-style'><p className='finish-later'>I will finish this later, continue to The Brane</p></a>
        </FinishContainer>
      </QuestionContainer>
    )
  }
}
