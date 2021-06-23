import React, { Component } from 'react'
import { InputRow, Submit } from 'elements/form'
import { FinishContainer } from '../../containers/OnBoard/elements'
import { InputTag } from 'components/InputTag'
import { QuestionContainer, QuestionForm } from './elements'

export default class Skills extends Component {
  state = {
    error: null,
  }

  onClick = () => {
    if (this.props.skills.length === 0) {
      this.setState({
        error: 'Please enter all relevant skills',
      })
    } else {
      this.props.onContinue()
    }
  }

  render () {
    const { onContinue, onPrevious, skills, onChange, addTag, later } = this.props
    return (
      <QuestionContainer>
        <QuestionForm>
          <div className='q-width'>
            <a onClick={onPrevious} className='navigation'>Previous</a>
            <h5>Question 6 of 8</h5>
            <p className='title'>What skills do you have?<br />Select all relevant skills.</p>
          </div>
          <div className='q-width'>
            <InputRow className='input-style' >
              <p className='input-label'>Type the name of the skill(s) you possess</p>
              <InputTag tags={skills} removeTag={onChange} addTag={addTag} />
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
