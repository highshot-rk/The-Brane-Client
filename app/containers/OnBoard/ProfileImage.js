import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  AddImg,
} from './elements'
import Dropzone from 'react-dropzone'
import defaultProfile from 'components/Icons/default_profile.svg'

export default class ProfileImage extends Component {
  render () {
    const {
      picture,
      onDrop,
    } = this.props
    return (
      <AddImg>
        <Dropzone
          accept='image/jpeg, image/png'
          onDrop={onDrop}
          style={{}}
        >
          <div className='image-wrapper'>
            <img src={(picture && picture.preview) || defaultProfile} />
          </div>
          <div className='add'>+</div>
          <p>{picture ? 'Change profile picture' : 'Add a profile picture'}</p>
        </Dropzone>
      </AddImg>
    )
  }
}

ProfileImage.propTypes = {
  picture: PropTypes.object,
  onDrop: PropTypes.func,
}
