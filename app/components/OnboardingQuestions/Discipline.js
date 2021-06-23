import React, { Component } from 'react'
import { InputRow, Submit } from 'elements/form'
import { FinishContainer } from '../../containers/OnBoard/elements'
import { YagoInputTag } from '../YagoDropDown/yagoInputTag'
import { QuestionContainer, QuestionForm } from './elements'

export default class Discipline extends Component {
  state = {
    error: null,
  }

  onClick = () => {
    if (this.props.disciplines.length === 0) {
      this.setState({
        error: 'Please enter the discipline(s) you studied',
      })
    } else {
      this.props.onContinue()
    }
  }

  render () {
    const { onContinue, onPrevious, disciplines, onChange, addTag, later } = this.props
    return (
      <QuestionContainer>
        <QuestionForm>
          <div className='q-width'>
            <a onClick={onPrevious}>Previous</a>
            <h5>Question 3 of 8</h5>
            <p className='title'>What discipline(s) did you study?<br />Select all relevant disciplines.</p>
          </div>
          <div className='q-width'>
            <InputRow className='input-style'>
              <p className='input-label'>Type the name of the discipline(s) you studied</p>
              <YagoInputTag question={'academic'} placeholder={'Discipline'} query={disciplines} tags={disciplines} removeTag={onChange} addTag={addTag} />
              {this.state.error && <p className='question-error'>{this.state.error}</p>}
            </InputRow>
            <div className='q-btn'>
              <div>
                <a onClick={onContinue}>Skip the question</a>
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
