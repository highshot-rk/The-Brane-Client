import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  WindowWrapper,
  Window,
  WindowHeader,
} from 'elements/window'
import {
  Submit,
  FormActions,
  Cancel,
} from 'elements/form'
import {
  Back,
} from './elements'
import ArrowIcon from './back-arrow.svg'
import Overlay from '../Overlay'
import LinkTitle from './LinkTitle'
import {
  createLink,
  deleteLink,
  updateImage,
} from 'api/link'
import withFormWindowLogic from '../FormWindowLogic'
import PathObjectForm from '../PathObjectForm'
import { getUpDownText } from 'utils/tags'
import { createEditableLink } from 'utils/factories'

export class LinkCreationWindow extends Component {
  static propTypes = {
    // Deletes existing link and creates a new one
    replace: PropTypes.bool,

    parentLink: PropTypes.object,
    childLink: PropTypes.object,
    showNodeCreationWindow: PropTypes.func,
    showBack: PropTypes.bool,

    // from FormWindowLogic
    setData: PropTypes.func,
    data: PropTypes.object,
    readyToSubmit: PropTypes.bool,
    saving: PropTypes.bool,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
  }

  componentDidMount () {
    const parentLink = createEditableLink(this.props.parentLink || {})
    const childLink = createEditableLink(this.props.childLink || {})

    this.props.setData({
      replace: this.props.replace,
      links: [parentLink, childLink],
    }, false)
  }

  onLinkPropertyChanged = (linkIndex, property, value) => {
    const data = this.props.data
    const newLinks = [...data.links]

    newLinks[linkIndex] = {
      ...newLinks[linkIndex],
      [property]: value,
    }

    if (property === 'node') {
      newLinks[linkIndex].text = value ? value.title : ''
    }

    this.props.setData({
      links: newLinks,
    })
  }

  onLinkTypeChanged = ({ type, direction }) => {
    this.props.setData({
      linkType: type,
      linkDirection: direction,
    })
  }

  render () {
    const {
      readyToSubmit,
      saving,
      showNodeCreationWindow,
      onCancel,
      onClose,
      onSave,
      setData,
      data,
    } = this.props
    const {
      links,
      linkType,
      linkDirection,
      title,
      definition,
      picture,
    } = data

    return (
      <div>
        <WindowWrapper zIndex={7}>
          <Overlay onClose={onClose} />
          <Window>
            <WindowHeader>
              Create link
              {this.props.showBack &&
              <Back onClick={() => showNodeCreationWindow()}>
                <img src={ArrowIcon} alt='Back' />
                <span>Back to Node creation</span>
              </Back>
              }
            </WindowHeader>
            <LinkTitle
              links={links}
              linkType={linkType}
              linkDirection={linkDirection}
              title={title}
              onLinkTypeChanged={this.onLinkTypeChanged}
              onLinkTextChanged={(linkIndex, value) => this.onLinkPropertyChanged(linkIndex, 'text', value)}
              onLinkTargetChanged={(linkIndex, target) => this.onLinkPropertyChanged(linkIndex, 'node', target)}
              showCreateVerb={this.showCreateVerb}
            />
            <PathObjectForm
              picture={picture}
              definition={definition}
              onPictureChange={picture => setData({ picture })}
              onDefinitionChange={definition => setData({ definition })}
            />
            <FormActions>
              <Cancel onClick={onCancel}>Cancel</Cancel>
              <Submit
                disabled={!readyToSubmit}
                onClick={onSave}
              >
                {saving ? 'Saving...' : 'Submit'}
              </Submit>
            </FormActions>
          </Window>
        </WindowWrapper>
      </div>
    )
  }
}

export default withFormWindowLogic(LinkCreationWindow, {
  defaultData: {
    links: [
      {
        text: '',
        isParent: true,
        node: null,
      },
      {
        text: '',
        isParent: false,
        node: null,
      },
    ],
    linkType: 'link',
    linkDirection: 'child',
    definition: '',
    picture: null,
    missingFields: [],
  },
  readyToSubmit ({ links }) {
    return links[0].node && links[1].node
  },
  onSave: async (data) => {
    const { links, definition, picture, linkType, linkDirection, replace } = data
    const parent = linkDirection === 'child' ? links[0] : links[1]
    const child = linkDirection === 'child' ? links[1] : links[0]
    const parentKey = parent.node._key || parent.node._id
    const childKey = child.node._key || child.node._id

    const link = await createLink({
      parentKey,
      childKey,
      linkType,
      definition,
    }
    )

    if (picture) {
      await updateImage(link.key._key, picture)
    }
    if (replace) {
      await deleteLink(replace.from, replace.to)
    }
  },
  afterSave (data, props) {
    const [
      parent,
      child,
    ] = data.links
    props.updateNodes([
      parent.node._key || parent.node._id,
      child.node._key || child.node._id,
    ])
  },
  successMessage ({ linkType, linkDirection, links }) {
    const downText = getUpDownText(linkType).down
    const parent = linkDirection === 'child' ? links[1] : links[0]
    const child = linkDirection === 'child' ? links[0] : links[1]

    return `You created a new link: <strong>${child.text} ${downText} ${parent.text}!</strong>`
  },
  errorMessage: 'Error creating link',
})
