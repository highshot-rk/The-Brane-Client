import React, { Component } from 'react'
import { Window } from 'elements/window'
import 'react-select/dist/react-select.css'
import { InputRow, Submit } from 'elements/form'
import { WindowHeader, ProfileInputWrapper, DismissButton, Error, Instructions, Selectors, SelectWrapper } from './elements'
import ProfileImage from './ProfileImage'
import Arrow from './Arrow'
import TagSelector from 'components/TagSelector'
import { keyToTree } from 'utils/tags'
import Select from 'react-select'
import { getNode } from 'api/node'

const INDIVIDUALS_CLUSTER = '85165563'
const UNIVERSITIES_CLUSTER = '85165550'

class ProfileInformation extends Component {
  state = {
    universities: null,
  }

  getUniversities = () => {
    getNode(UNIVERSITIES_CLUSTER).then(response => {
      this.setState({
        universities: response.data.children.map(uni => ({
          ...uni,
          _key: uni._id,
          label: uni.title,
          value: uni._id,
        })),
      })
    })
  }
  componentWillMount = () => {
    this.getUniversities()
  }

  render () {
    const {
      fn,
      username,
      profileImage,
      onUsernameChange,
      onProfileImageChange,
      groups,
      institutions,
      onGroupsChange,
      onInstitutionsChange,
      onContinue,
    } = this.props
    return (
      <Window frameless width='994px' height={'432px'} padding='0 66px'>
        <WindowHeader>Welcome {fn}!</WindowHeader>
        <Instructions>You will see your home node update as you fill in more information.</Instructions>
        {this.state.error && <Error>{this.state.error}</Error>}
        <ProfileImage picture={profileImage} onDrop={onProfileImageChange} />
        <InputRow marginBottom='15px'>
          <ProfileInputWrapper>
            <input type='text' value={username} onChange={e => onUsernameChange(e.target.value)} placeholder='Choose your username' />
          </ProfileInputWrapper>
        </InputRow>
        <Selectors>
          <TagSelector
            tagTree={keyToTree(INDIVIDUALS_CLUSTER).children}
            tags={groups}
            placeholder='What group(s) best describe you?'
            onChange={onGroupsChange}
            arrowRenderer={Arrow}
          />
          <SelectWrapper>
            <Select
              isLoading={this.state.universities === null}
              options={this.state.universities}
              multi
              value={institutions}
              arrowRenderer={Arrow}
              placeholder='Which universities are you related to?'
              onChange={onInstitutionsChange}
            />
          </SelectWrapper>
        </Selectors>
        <Submit onClick={onContinue} style={{ marginTop: 50 }} >
          Continue
        </Submit>
        <DismissButton onClick={this.props.onDismiss} >Do it later</DismissButton>
      </Window>
    )
  }
}

export default ProfileInformation
