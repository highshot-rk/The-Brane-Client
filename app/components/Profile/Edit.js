import React, { Component } from 'react'
import { SideBar, InputWrapper } from './elements'
import locationIcon from './icons/location.svg'
import twitterIcon from './icons/twitter.svg'
import academiaIcon from './icons/academia.svg'
import linkedInIcon from './icons/linkedin.svg'
import researchGateIcon from './icons/research-gate.svg'
import educationIcon from './icons/university_hat.svg'
import { AddRowButton } from 'elements/form'
const MAX_TEXTAREA = 400
export default class Edit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      descriptionCharCount: this.props.data.description.length,
    }
  }
  onUpdateDescription = ({ target: { value } }) => {
    let newValue = value
    const valueLength = value.length
    if (valueLength >= MAX_TEXTAREA) {
      newValue = value.substring(0, MAX_TEXTAREA)
    }
    this.setState({ descriptionCharCount: newValue.length })
    this.props.updateValue('description', newValue)
  }
  render () {
    const {
      data,
      updateValue,
    } = this.props
    return (
      <SideBar editing>
        <InputWrapper large>
          <input
            placeholder='First Name'
            onChange={e => updateValue('firstName', e.target.value)}
            value={data.firstName || ''} />
        </InputWrapper>
        <InputWrapper large>
          <input
            placeholder='Last Name'
            onChange={e => updateValue('lastName', e.target.value)}
            value={data.lastName || ''} />
        </InputWrapper>
        <InputWrapper>
          <textarea
            placeholder='Headline'
            value={data.shortDescription}
            onChange={e => updateValue('shortDescription', e.target.value)}
          />
        </InputWrapper>
        { /* TODO: tags */}
        <InputWrapper>
          <textarea
            placeholder='Summary'
            onChange={this.onUpdateDescription}
            value={data.description}
            rows='4'
          />
          <p>{this.state.descriptionCharCount}/{MAX_TEXTAREA}</p>
        </InputWrapper>
        {
          data.education.map(
            (name, index) =>
              <InputWrapper key={index} transparentIcon >
                <img style={{ padding: '9px 5px' }} src={educationIcon} />
                <input
                  onChange={e => updateValue('educationItem', e.target.value, index)}
                  placeholder='Education'
                  value={name} />
                <button onClick={() => updateValue('revEducation', index)}>x</button>
              </InputWrapper>
          )
        }
        <AddRowButton gray condensed onClick={() => updateValue('addEducation')}>
          <button>+</button>
          <span>Add Education</span>
        </AddRowButton>
        <InputWrapper transparentIcon>
          <img src={locationIcon} />
          <input placeholder='Location' value={data.location} onChange={e => updateValue('location', e.target.value)} />
        </InputWrapper>
        <InputWrapper>
          <img src={twitterIcon} />
          <input value={data.twitter} onChange={e => updateValue('twitter', e.target.value)} />
        </InputWrapper>
        <InputWrapper>
          <img height={30} src={linkedInIcon} />
          <input value={data.linkedIn} onChange={e => updateValue('linkedIn', e.target.value)} />
        </InputWrapper>
        <InputWrapper>
          <img src={researchGateIcon} />
          <input value={data.researchGate} onChange={e => updateValue('researchGate', e.target.value)} />
        </InputWrapper>
        <InputWrapper>
          <img height={31} src={academiaIcon} />
          <input value={data.academia} onChange={e => updateValue('academia', e.target.value)} />
        </InputWrapper>
      </SideBar>
    )
  }
}
