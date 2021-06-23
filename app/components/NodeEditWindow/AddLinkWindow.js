import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  WindowWrapper,
  Window,
  WindowHeader,
} from 'elements/window'
import {
  Submit, Cancel, FormActions,
} from 'elements/form'
import Overlay from '../Overlay'
import CreateLineage from '../CreateLineage'
import withFormWindowLogic from '../FormWindowLogic'
import PathObjectForm from '../PathObjectForm'
import { createLink, updateImage } from 'api/link'

export class AddLinkWindow extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func,

    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    dirty: PropTypes.bool,
    setData: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    onAddedLink: PropTypes.func,
  }
  state = {
    node: null,
    text: '',
    isParent: false,
    type: 'link',
    picture: null,
    description: '',
  }
  updateVerb (isParent) {
    return this.state.verb - (this.state.verb % 2) + (isParent ? 0 : 1)
  }
  updateProperty (property, value) {
    const changes = {
      [property]: value,
    }

    if (property === 'isParent') {
      changes.verb = this.updateVerb(value)
    }
    this.setState(changes, () => {
      if (this.state.category !== null) {
        // Update data so it is available when we save and to mark the form as dirty
        this.props.setData(this.state)
      }
    })
  }
  render () {
    const {
      title,
      onClose,
      onCancel,
      onSave,
      dirty,
    } = this.props

    return (
      <WindowWrapper zIndex={4}>
        <Overlay onClose={onClose} />
        <Window allowOverflow>
          <WindowHeader>Add Link</WindowHeader>
          <CreateLineage
            onLinkTypeChanged={(linkIndex, type) => this.updateProperty('type', type)}
            onLinkTextChanged={(linkIndex, text) => this.updateProperty('text', text)}
            onLinkTargetChanged={(linkIndex, node) => this.updateProperty('node', node)}
            onLinkToggleIsParent={() => this.updateProperty('isParent', !this.state.isParent)}
            showCreateVerb={() => {}}
            links={[this.state]}
            title={title}
            verbSelectorDirection={'top'}
          />
          <PathObjectForm
            picture={this.state.picture}
            definition={this.state.definition}
            onPictureChange={picture => this.updateProperty('picture', picture)}
            onDefinitionChange={description => this.updateProperty('description', description)}
          />
          <FormActions>
            <Cancel onClick={onCancel}>Cancel</Cancel>
            <Submit disabled={!dirty} onClick={onSave}>Submit</Submit>
          </FormActions>
        </Window>
      </WindowWrapper>
    )
  }
}

AddLinkWindow.propTypes = {

}

export default withFormWindowLogic(AddLinkWindow, {
  readyToSubmit ({ category }) {
    return category
  },
  onSave: async ({ node, isParent, type, picture, description, linkId }, props) => {
    const parentKey = isParent ? node._id : props.nodeKey
    const childKey = isParent ? props.nodeKey : node._id

    const link = await createLink({
      parentKey,
      childKey,
      linkType: type,
      definition: description,
    })

    if (picture) {
      await updateImage(link.data._id, picture)
    }

    return link.data._id
  },
  afterSave (data, props, linkId) {
    props.onAddedLink({
      ...data,
      linkId,
    })
  },
  successMessage: 'You created a new link!',
  errorMessage: 'Error creating link',
})
