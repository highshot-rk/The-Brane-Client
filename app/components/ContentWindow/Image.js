import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import {
  SaveButton,
} from './elements'
import addImage from './icons/add-image.svg'

export default class Image extends Component {
  static propTypes = {
    onImageDropped: PropTypes.func,
    saveImage: PropTypes.func,
    previewImg: PropTypes.obj,
    img: PropTypes.string,
  }
  image = () => {
    const {
      previewImg,
      img,
    } = this.props

    if (previewImg) {
      return <img
        src={previewImg.preview}
        alt='No description'
      />
    } else if (img) {
      return <img
        src={img}
        alt={'No description'}
      />
    } else {
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      return <img
        src={addImage}
        className='node-preview-window__image-icon'
        alt='Add image to node'
      />
    }
  }
  render () {
    const {
      onImageDropped,
      previewImg,
      saveImage,
    } = this.props
    return (
      <div className='node-preview-window__image'>
        <Dropzone
          accept='image/jpeg, image/png'
          onDrop={onImageDropped}
          activeClassName='dropbox-active'
          style={{ width: '100%', cursor: 'pointer', transition: 'all .5s' }}
        >
          <div className='node-preview-window__image'>
            { this.image() }
          </div>
        </Dropzone>
        {previewImg && <SaveButton saveImage onClick={saveImage}>
          {'Save Image'}
        </SaveButton>}
      </div>
    )
  }
}
