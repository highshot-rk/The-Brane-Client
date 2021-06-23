import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  AddImg,
} from './elements'
import Dropzone from 'react-dropzone'

export default class UploadImage extends Component {
  render () {
    const {
      picture,
      onRemove,
      onDrop,
    } = this.props
    return (
      <AddImg preview={!!picture && picture.preview}>
        <Dropzone
          accept='image/jpeg, image/png'
          onDrop={onDrop}
          style={{}}
        >
          <div className='remove' onClick={(e) => { e.stopPropagation(); onRemove() }}>&times;</div>
          <div className='placeholder'>
            <p>Drag your 560 x 204 image here</p>
            <p className='browse'>or browse</p>
          </div>
        </Dropzone>
      </AddImg>
    )
  }
}

UploadImage.propTypes = {
  picture: PropTypes.object,
  onRemove: PropTypes.func,
  onDrop: PropTypes.func,
}
