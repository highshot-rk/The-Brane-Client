import React, { Component } from 'react'
import { InputRow, Submit } from 'elements/form'
import { FinishContainer } from '../../containers/OnBoard/elements'
import { YagoInputTag } from '../YagoDropDown/yagoInputTag'
import { QuestionContainer, QuestionForm } from './elements'

export default class Org extends Component {
  state = {
    error: null,
  }

  onClick = () => {
    if (this.props.organisation.length === 0) {
      this.setState({
        error: 'Please enter which organisation(s) you work for',
      })
    } else {
      this.props.onContinue()
    }
  }
  render () {
    const { onContinue, onPrevious, organisation, onChange, addTag, later } = this.props
    return (
      <QuestionContainer>
        <QuestionForm>
          <div className='q-width'>
            <a onClick={onPrevious} className='navigation'>Previous</a>
            <h5>Question 4 of 8</h5>
            <p className='title'>For which organization(s) do you work?<br />Select all relevant organisations.</p>
          </div>
          <div className='q-width'>
            <InputRow className='input-style'>
              <p className='input-label'>Type the name of the organisation(s) you work for</p>
              <YagoInputTag question={'organization'} placeholder={'Organization'} query={organisation} tags={organisation} removeTag={onChange} addTag={addTag} />
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
