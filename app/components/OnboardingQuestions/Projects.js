import React, { Component } from 'react'
import { InputRow, Submit } from 'elements/form'
import { ProfileInputWrapper, FinishContainer } from '../../containers/OnBoard/elements'
import { InputTag } from 'components/InputTag'
import { QuestionContainer, QuestionForm } from './elements'

export default class Projects extends Component {
  state = {
    numChildren: [{ name: '', description: '', tags: [] }],
  }

  createUI () {
    return this.props.projects.map((el, index) => (
      <div key={index}>
        <InputRow className='project-input-1' >
          <div className='project-remove'>
            <a className='navigation a-remove' onClick={() => this.props.onRemoveChild(index)} >Remove</a>
          </div>
          <p className='input-label'>Type project name</p>
          <ProfileInputWrapper className='input-wrapper-margin'>
            <input type='text' placeholder='Name' value={el.name || ''} onChange={(event) => this.props.onTextChange(event, index)} />
          </ProfileInputWrapper>
        </InputRow>
        <InputRow className='project-input-2' >
          <p className='input-label'>Type project description</p>
          <ProfileInputWrapper className='input-wrapper'>
            <input type='text' placeholder='Description' value={el.description} onChange={(event) => this.props.onDescriptionChange(event, index)} />
          </ProfileInputWrapper>
        </InputRow>
        <InputRow className='project-input-3' >
          <p className='input-label'>Type project keywords</p>
          <InputTag tags={el.tags} addTag={(tag) => this.props.onAddTag(tag, index)} />
        </InputRow>
        <hr className='style' />
      </div>
    ))
  }

  onClick = () => {
    if (this.props.projects[0].name < 1 || this.props.projects[0].description < 1 || this.props.projects[0].tags.length < 1) {
      this.setState({
        error: 'Please enter any relevant project(s)',
      })
    } else {
      this.props.onContinue()
    }
  }

  render () {
    const { onContinue, onPrevious, later } = this.props
    return (
      <QuestionContainer>
        <QuestionForm className='alt-styling'>
          <div className='q-width2'>
            <a onClick={onPrevious} className='navigation'>Previous</a>
            <h5>Question 7 of 8</h5>
            <p className='title'>Do you have any project you would like to share?</p>
          </div>
          <div className='q-width'>
            <form onSubmit={this.handleSubmit}>{this.createUI()}</form>
            <h6 className='h6-hover' onClick={() => this.props.onAddChild(this.props.projects)}>Add another project</h6>
            {this.state.error && <p className='question-error'>{this.state.error}</p>}
            <div className='project-skip-btn'>
              <div className='project-skip-row'>
                <a className='navigation' onClick={onContinue}>Skip the question</a>
                <Submit className='btn-submit' onClick={this.onClick}>NEXT</Submit>
              </div>
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
