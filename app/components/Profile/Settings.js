import React, { Component } from 'react'
import { Title, SectionTitle, SettingsWrapper } from './elements'
import {
  InputRow,
  InputWrapper,
  LargeButton,
} from 'elements/form'
import { featureEnabled } from 'utils/features'
import PropTypes from 'prop-types'

export default class Settings extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }),
    saveChanges: PropTypes.func,
    onDeleteAccount: PropTypes.func,
  }
  state = {
    firstName: this.props.profile.firstName,
    lastName: this.props.profile.lastName,
    email: this.props.profile.email,

    confirmDelete: false,
  }

  updateValue = (name, e) => {
    this.setState({
      [name]: e.target.value,
    })
  }
  onDeleteAccount = () => {
    this.setState({
      confirmDelete: true,
    })
  }

  saveChanges = () => {
    this.props.saveChanges({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
    })
  }

  mapPropToStates
  render () {
    return <SettingsWrapper>
      <Title>Account</Title>
      <SectionTitle>Name</SectionTitle>
      <InputRow>
        <InputWrapper>
          <input type='text' value={this.state.firstName} onChange={e => this.updateValue('firstName', e)} />
        </InputWrapper>
        <InputWrapper>
          <input type='text' value={this.state.lastName} onChange={e => this.updateValue('lastName', e)} />
        </InputWrapper>
      </InputRow>
      <SectionTitle>Email</SectionTitle>
      <InputRow>
        <InputWrapper>
          <input type='text' value={this.state.email} onChange={e => this.updateValue('email', e)} disabled />
        </InputWrapper>
      </InputRow>
      {featureEnabled('savedPaths') && (
        <label htmlFor='saved-paths-check'>
          <input id='saved-paths-check' type='checkbox' />
          Show paths from my last session
        </label>
      )}
      {featureEnabled('profileActivity') && (
        <>
          <SectionTitle>Activity</SectionTitle>
          <label htmlFor='edits-on-profile-check'>
            <input id='edits-on-profile-check' type='checkbox' />
            Show my edits on my profile under Activity
          </label>
        </>
      )}

      <LargeButton style={{ float: 'none', marginLeft: 0 }} background='#00B6D5' onClick={this.saveChanges}>Save Changes</LargeButton>

      <SectionTitle>Delete Account</SectionTitle>
      <LargeButton background='#E84F4F' style={{ float: 'none', marginLeft: 0 }} onClick={this.props.onDeleteAccount}>Delete Account</LargeButton>

    </SettingsWrapper>
  }
}
