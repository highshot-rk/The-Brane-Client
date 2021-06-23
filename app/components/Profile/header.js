import React, { Component } from 'react'
import {
  HeaderWrapper,
  // Thumb,
  Button,
  HeaderBackground,
  Toolbar,
  Share,
  EditImageOverlay,
} from './elements'
import Tabs from '../Tabs'
import shareIcon from '../Icons/share.svg'
// import defaultProfile from './default_profile.png'
import Dropzone from 'react-dropzone'
import addNewImageIcon from './icons/addImage.svg'
import defaultHeaderImage from './cover_profile.jpg'
import { featureEnabled } from 'utils/features'
import PropTypes from 'prop-types'

export default class Header extends Component {
  static propTypes = {
    isSelf: PropTypes.string,
    isFollowing: PropTypes.arrayOf(PropTypes.string),
    activeTab: PropTypes.string,
    onSelectTab: PropTypes.func,
    toggleFollowing: PropTypes.func,
    toggleEdit: PropTypes.func,
    editing: PropTypes.bool,
    saveChanges: PropTypes.func,
    profileImg: PropTypes.string,
    coverImg: PropTypes.string,
    onDrop: PropTypes.func,
  }
  evaluateImage = img => {
    if (img) {
      if (img.preview) {
        return img.preview
      }
      return img
    }
    return null
  }
  getTabs = () => {
    const tabs = []
    if (featureEnabled('profileActivity')) {
      tabs.push('Activity')
    }
    if (featureEnabled('savedPaths')) {
      tabs.push('Paths')
    }
    if (featureEnabled('profilePublications')) {
      tabs.push('Publications')
    }

    tabs.push('Settings')
    return tabs
  }
  render () {
    const {
      isSelf,
      isFollowing,
      activeTab,
      onSelectTab,
      toggleFollowing,
      toggleEdit,
      editing,
      saveChanges,
      // profileImg,
      coverImg,
      onDrop,
    } = this.props
    const dropzoneProps = {
      disabled: !editing,
      className: 'dropzonePicture',
      activeClassName: 'active',
      accept: 'image/jpeg, image/png',
      multiple: false,
    }
    return (
      <HeaderWrapper>
        <Dropzone
          onDrop={img => onDrop(img, 'coverImg')}
          {...dropzoneProps}
          className='dropzoneCover'>
          <HeaderBackground headerImage={this.evaluateImage(coverImg) || defaultHeaderImage} />
          <EditImageOverlay header edited={coverImg && coverImg.preview} active={editing}>
            <img src={addNewImageIcon} alt={'Change header'} />
            <span>Change your Cover picture</span>
          </EditImageOverlay>
        </Dropzone>
        {/* Save profile changes */}
        <Dropzone
          {...dropzoneProps}
          onDrop={img => onDrop(img, 'profileImg')}
        >
          {/* <Thumb default={!profileImg}>
            <img src={this.evaluateImage(profileImg) || defaultProfile} alt='user_thumbnail' />
            <EditImageOverlay edited={profileImg && profileImg.preview} active={editing}>
              <img src={addNewImageIcon} alt='Change user thumbnail' />
              <span>Change your Profile picture</span>
            </EditImageOverlay>
          </Thumb> */}
        </Dropzone>

        <Tabs
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          tabs={this.getTabs()}
        />
        <Toolbar style={{ display: featureEnabled('profileSidebar') ? 'display' : 'none' }}>
          {!isSelf
            ? (
              <span>
                <Button onClick={toggleFollowing} type='button' blue>{isFollowing ? 'Stop Following' : 'Follow'}</Button>
                <Button type='button'>Send Message</Button>
              </span>
            )
            : editing
              ? (
                <span>
                  <Button onClick={toggleEdit} type='button'>Cancel</Button>
                  <Button onClick={saveChanges} type='button' blueHollow>Save</Button>
                </span>
              )
              : (
                <span>
                  <Button onClick={toggleEdit} type='button'>Edit</Button>
                </span>
              )
          }
          {!editing && <Share type='button'>
            <img src={shareIcon} alt='Share' width='40' />
          </Share>
          }
        </Toolbar>
      </HeaderWrapper>
    )
  }
}
