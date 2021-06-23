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
import {
  getPredicates,
} from 'api/predicate'
import {
  getNode,
} from 'api/node'
import Overlay from '../Overlay'
import withFormWindowLogic from '../FormWindowLogic'
import PathObjectForm from '../PathObjectForm'
import { getLink } from 'api/link'
import { getVerbFlatIndex } from 'utils/verbs'
import { cloneDeep } from 'lodash-es'
import VerbSelector from '../VerbSelector'
import { LinkTargetsRow } from './elements'
import { saveChanges } from './saveChanges'
import CreateVerb from '../CreateVerb'

export class EditLinkWindow extends Component {
  componentDidMount = async () => {
    const {
      parentId,
      childId,
      setData,
    } = this.props
    const [
      verbs,
      parentNode,
      childNode,
      linkDetails,
    ] = await Promise.all([
      getPredicates(),
      getNode(parentId),
      getNode(childId),
      getLink(parentId, childId),
    ]).then(responses => responses.map(response => response.data))
    // const { data: uploads } = await getLinkUploads(linkDetails._key)

    const data = {
      description: linkDetails.a ? linkDetails.a.description : '',
      verb: getVerbFlatIndex(verbs, linkDetails.d, linkDetails.u, true),
    }

    setData({
      ...data,
      verbs,
      originalData: cloneDeep(data),
      // picture: uploads[0] ? {
      //   changed: false,
      //   preview: uploads[0].url,
      // } : null,
      parentNode,
      childNode,
      linkDetails,
      // uploads,
      showCreateVerb: false,
    }, false)
  }
  closeCreateVerb = (downText, upText) => {
    const newData = {
      showCreateVerb: false,
    }
    const adding = downText && upText

    if (adding) {
      newData.verbs = [...this.props.data.verbs, [downText, upText]]
      newData.verb = (newData.verbs.length - 1) * 2
    }

    this.props.setData(
      newData
    )
  }
  render () {
    const {
      data,
      onClose,
      onCancel,
      onSave,
      dirty,
      setData,
    } = this.props
    let content = 'Loading...'

    if (data.parentNode) {
      content = (
        <>
          <WindowHeader>Edit Link</WindowHeader>
          <LinkTargetsRow>
            <span>{data.parentNode.node.t}</span>
            <VerbSelector
              verbs={data.verbs}
              selected={data.verb}
              verbsOffset={0}
              onChange={verb => setData({ verb })}
              showCreateVerb={() => setData({ showCreateVerb: true })}
            />
            <span>{data.childNode.node.t}</span>
          </LinkTargetsRow>
          <PathObjectForm
            picture={data.picture}
            definition={data.description}
            onPictureChange={picture => setData({ picture })}
            onDefinitionChange={description => setData({ description })} />
          <FormActions>
            <Cancel onClick={onCancel}>Cancel</Cancel>
            <Submit disabled={!dirty} onClick={onSave}>Submit</Submit>
          </FormActions>
        </>
      )
    }

    return (
      <div>
        <WindowWrapper zIndex={7}>
          <Overlay onClose={onClose} />
          <Window>
            {content}
          </Window>
        </WindowWrapper>
        {data.showCreateVerb && <CreateVerb onClose={this.closeCreateVerb} />}
      </div>
    )
  }
}

EditLinkWindow.propTypes = {
  parentNode: PropTypes.object,
  childNode: PropTypes.object,
}

export default withFormWindowLogic(EditLinkWindow, {
  onSave (data, props) {
    return saveChanges(data, data.originalData)
  },
  // TODO: when the fixed path uses the predicate while filtering
  // it will need to update the up and down text
  successMessage: 'Saved changes to link',
  errorMessage: 'Error while saving changes',
})
