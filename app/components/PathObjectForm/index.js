import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { InputRow, InputWrapper, ErrorMessage } from 'elements/form'
import UploadImage from '../UploadImage'
import { featureEnabled } from 'utils/features'

export default class PathObjectForm extends Component {
  render () {
    const {
      missingFields,
      picture,
      definition,
      onPictureChange,
      onDefinitionChange,
    } = this.props
    return (
      <div>
        <InputRow direction='vertical'>
          <InputWrapper
            error={missingFields.includes('definition')}
            height='auto'
            style={{ flex: 1 }}>
            <textarea
              value={definition}
              onChange={e => onDefinitionChange(e.target.value)}
              placeholder='Enter a definition'
            />
          </InputWrapper>
          {missingFields.includes('definition') && <ErrorMessage>{this.missingFieldText('definition')}</ErrorMessage>}
        </InputRow>
        {
          featureEnabled('uploadImages') && <UploadImage
            picture={picture}
            onDrop={acceptedFiles => onPictureChange(acceptedFiles[0])}
            onRemove={() => onPictureChange(null)}
          />
        }
      </div>
    )
  }
}

PathObjectForm.propTypes = {
  missingFields: PropTypes.arrayOf(PropTypes.oneOf([
    'definition',
    'title',
    'tags',
  ])),
}

PathObjectForm.defaultProps = {
  missingFields: [],
}
