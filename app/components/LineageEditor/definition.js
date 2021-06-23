import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  DefinitionHeading,
  DefinitionContainer,
  PreviewIcon,
} from './elements'
import previewIcon from './preview.svg'
import { featureEnabled } from 'utils/features'

export default class Definition extends Component {
  render () {
    return (
      <DefinitionContainer>
        <td colSpan='6'>
          {featureEnabled('linkContentWindow') && <PreviewIcon onClick={this.props.showPreview} src={previewIcon} />}
          <DefinitionHeading>Definition</DefinitionHeading>
          <p>{this.props.definition ? this.props.definition : 'No definition'}</p>
          <DefinitionHeading>References</DefinitionHeading>
          <p>No references</p>
        </td>
      </DefinitionContainer>
    )
  }
}

Definition.propTypes = {
  showPreview: PropTypes.func,
}
