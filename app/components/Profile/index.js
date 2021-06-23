import React, { Component } from 'react'

import { cloneDeep } from 'lodash-es'
import Header from './header'
import { WindowWrapper, Window } from 'elements/window'
import Overlay from '../Overlay'
import Side from './Side'
import Content from './Content'
import {
  getFollowing,
  followUser,
  unFollowUser,
  getUserFollowers,
  getUserFollowing,
} from 'api/profile'
import Dialog from '../Dialog'
import { connect } from 'react-redux'
import NewPublication from '../NewPublication'
import { composeProfileReducer, loadProfile, removeAccount, updateProfile } from './slice'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { node } from 'utils/shared-proptypes'

class Profile extends Component {
  static propTypes = {
    userId: PropTypes.string,
    loadProfile: PropTypes.func,
    match: PropTypes.object,
    restoreSavedPath: PropTypes.func,
    removeAccount: PropTypes.func,
    updateProfile: PropTypes.func,
    history: PropTypes.object,
    activePathId: PropTypes.string,
    loading: PropTypes.bool,
    focusedNode: node,
    profile: PropTypes.object,
  }
  constructor (props) {
    super(props)
    const { userId } = this.props
    this.initialState = {
      showNewPublication: false,
      editing: false,
      editData: null,
      isSelf: props.userId === userId,
      activeTab: 'Settings',
      tags: [],
      following: '0',
      followers: '0',
      work: '',
      education: [],
      location: '',
      shortDescription: '',
      description: '',
      twitter: '',
      linkedIn: '',
      academia: '',
      researchGate: '',
      pathToRestore: null,
      profileImg: null,
      coverImg: null,
      confirmDiscard: null,
      confirmDelete: false,
    }
    this.state = {
      ...this.initialState,
    }
  }

  fetchUserInfo = () => {
    Promise.all([
      getFollowing(),
      getUserFollowers(this.state.userId),
      getUserFollowing(this.state.userId),
    ]).then(([iFollowing, followers, following]) => {
      this.setState({
        isFollowing: iFollowing.data.includes(this.state.userId),
        following: following.data.length,
        followers: followers.data.length,
      })
    })
  }

  componentDidMount = async () => {
    await this.props.loadProfile(this.props.match.params.userId, this.props.token)
  }
  toggleFollowing = () => {
    const isFollowing = !this.state.isFollowing
    this.setState({
      isFollowing,
    })

    // TODO: we probably should handle failure, possibly by retrying since
    // we already showed the user it succeeded
    if (isFollowing) {
      followUser(this.state.userId)
    } else {
      unFollowUser(this.state.userId)
    }
  }

  handleConfirmDiscard = button => {
    switch (button) {
      case 'Discard':
        this.setState({
          editing: false,
          activeTab: 'Paths',
          confirmDiscard: null,
        })
        break
      case 'No discard':
        this.setState({
          confirmDiscard: null,
        })
        break
      // No default
    }
  }
  toggleEdit = () => {
    if (this.state.editing) {
      return this.setState({
        confirmDiscard: true,
      })
    }

    this.setState({
      editing: true,
      editData: cloneDeep(this.state),
      activeTab: 'Settings',
    })
  }
  updateValue = (property, value, index) => {
    const newData = this.state.editData

    switch (property) {
      case 'addEducation':
        newData.education = [
          ...newData.education,
          '',
        ]
        break
      case 'revEducation':
        newData.education = [
          ...newData.education.filter((n, _index) => _index !== value),
        ]
        break
      case 'educationItem':
        let _newEducation = newData.education
        _newEducation[index] = value
        newData.education = [
          ..._newEducation,
        ]
        break
      default:
        newData[property] = value
    }

    this.setState({
      editData: newData,
    })
  }
  handleConfirmResult = button => {
    switch (button) {
      case 'Cancel':
        this.setState({
          pathToRestore: null,
        })
        break
      case 'Open':
        this.props.restoreSavedPath(
          this.state.pathToRestore._key,
          this.state.pathToRestore.maxExpandedIndex,
          this.state.pathToRestore.data
        )
        this.onClose()
    }
  }
  handleConfirmDelete = button => {
    switch (button) {
      case 'I\'ve Changed My Mind':
        this.setState({
          confirmDelete: false,
        })
        break
      case 'Remove':
        this.props.removeAccount(this.props.match.params.userId)
    }
  }
  onDropImage = (img, prop) => {
    let newValues = this.state
    newValues[prop] = img[0]
    this.setState({
      ...newValues[prop],
    })
  }

  saveChanges = (profile) => {
    this.props.updateProfile(
      this.props.match.params.userId,
      profile
    )
  }

  toggleNewPublication = () => {
    this.setState({
      showNewPublication: !this.state.showNewPublication,
    })
  }
  onClose = () => {
    this.props.history.push(`/`)
  }
  render () {
    const {
      focusedNode,
      activePathId,
      loading,
    } = this.props
    const { showNewPublication } = this.state
    if (loading) {
      return (
        <WindowWrapper>
          <Overlay onClose={this.onClose} />
          <Window>
            Loading...
          </Window>
        </WindowWrapper>
      )
    }

    return (
      <WindowWrapper>
        <Overlay onClose={this.onClose} />
        <Window frameless width='1200px' height='800px' style={{ display: 'flex', flexDirection: 'column' }}>
          {showNewPublication &&
            <NewPublication
              toggleNewPublication={this.toggleNewPublication} />
          }
          <Header
            saveChanges={this.saveChanges}
            isSelf={this.state.isSelf}
            toggleFollowing={this.toggleFollowing}
            isFollowing={this.state.isFollowing}
            activeTab={this.state.activeTab}
            onSelectTab={(tab) => this.state.activeTab !== 'Settings' && this.setState({ activeTab: tab })}
            toggleEdit={this.toggleEdit}
            editing={this.state.editing}
            profileImg={this.state.profileImg}
            coverImg={this.state.coverImg}
            onDrop={this.onDropImage}
          />
          <div style={{ display: 'flex', flexGrow: 1 }}>
            <Side
              firstName={this.props.profile.firstName}
              lastName={this.props.profile.lastName}
              following={this.state.following}
              followers={this.state.followers}
              tags={this.state.tags}
              work={this.state.work}
              education={this.state.education}
              location={this.state.location}
              shortDescription={this.state.shortDescription}
              description={this.state.description}
              socialMedia={this.state.socialMedia}
              twitter={this.state.twitter}
              linkedIn={this.state.linkedIn}
              researchGate={this.state.researchGate}
              academia={this.state.academia}
              editing={this.state.editing}
              editData={this.state.editData}
              updateValue={this.updateValue}
            />
            <Content
              userId={this.props.userId}
              profile={this.props.profile}
              onDeleteAccount={() => this.setState({ confirmDelete: true })}
              activeTab={this.state.activeTab}
              focusedNode={focusedNode}
              activePathId={activePathId}
              toggleNewPublication={this.toggleNewPublication}
              confirmRestoreSavedPath={(path) => this.setState({ pathToRestore: path })}
              saveChanges={this.saveChanges}
            />
          </div>
        </Window>
        {this.state.pathToRestore &&
          <Dialog
            text='Do you want to open your previous path?'
            onClick={this.handleConfirmResult}
            buttons={['Cancel', 'Open']}
          />}
        {this.state.confirmDiscard &&
          <Dialog
            text='Are you sure you want to discard changes to this?'
            onClick={this.handleConfirmDiscard}
            buttons={['Discard', 'No discard']}
          />}
        {
          this.state.confirmDelete && <Dialog
            text='Are you sure you want to remove your account? If you decide to use The Brane again, you will need to create a new account.'
            buttons={[
              'Remove',
              'I\'ve Changed My Mind',
            ]}
            onClick={this.handleConfirmDelete}
          />
        }
      </WindowWrapper>
    )
  }
}

const mapDispatchToProps = {
  loadProfile: loadProfile,
  removeAccount: removeAccount,
  updateProfile: updateProfile,
}

function mapStateToProps (state) {
  const profile = state.profile[state.auth.userId] || { loading: true }
  const token = state.auth.authToken.user.token
  return {
    loading: profile.loading,
    profile: profile,
    token: token,
  }
}

const ProfilePage = compose(
  ...composeProfileReducer
)(connect(mapStateToProps, mapDispatchToProps)(
  Profile
))

export default ProfilePage
