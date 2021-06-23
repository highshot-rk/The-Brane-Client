import React, { Component } from 'react'
import { InputRow, Submit } from 'elements/form'
import { ProfileInputWrapper, FinishContainer } from '../../containers/OnBoard/elements'
import { YagoInput } from '../YagoDropDown'
import { QuestionContainer, QuestionForm } from './elements'

export default class Location extends Component {
  state = {
    error: null,
  }

  onClick = () => {
    if (this.props.location === '') {
      this.setState({
        error: 'Please enter a location',
      })
    } else {
      this.props.onContinue()
    }
  }

  render () {
    const { onContinue, onPrevious, onChange, location, later } = this.props
    return (
      <QuestionContainer>
        <QuestionForm>
          <div className='q-width'>
            <a onClick={onPrevious}>Previous</a>
            <h5>Question 1 of 8</h5>
            <p className='title'>Where are you located?</p>
          </div>
          <div className='q-width'>
            <InputRow className='input-style'>
              <p className='input-label'>Type your city name</p>
              <ProfileInputWrapper className='input-wrapper'>
                <YagoInput onChange={onChange} query={location} question={'city'} placeholder={'Location'} />
              </ProfileInputWrapper>
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
