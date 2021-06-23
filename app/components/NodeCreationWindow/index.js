import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TagSelector from '../TagSelector'
import {
  LinkCreationLink,
  Label,
} from './elements'
import {
  Row,
} from 'elements/layout'
import {
  WindowWrapper,
  Window,
  WindowHeader,
} from 'elements/window'
import {
  InputRow,
  Submit,
  HiddenLink,
  FormActions,
  Cancel,
} from 'elements/form'
import PathObjectForm from '../PathObjectForm'
import Overlay from '../Overlay'
import NodeInput from '../NodeInput'
import Dialog from '../Dialog'
import CreateVerb from '../CreateVerb'
import {
  isCluster,
} from 'utils/tags'

import {
  getNode,
  createNode,
  checkTitleUnique,
} from 'api/node'
import linkIcon from './link.svg'
import withFormWindowLogic from '../FormWindowLogic'
import { cloneDeep } from 'lodash-es'
import { clusterToPath } from 'utils/filter-tags'
import Lineage from 'components/CreateLineage'
import { createEditableLink } from 'utils/factories'
import { createLink } from 'api/link'

export class NodeCreationWindow extends Component {
  static propTypes = {
    focusedNode: PropTypes.object,
    showNodeEditWindow: PropTypes.func,
    parentId: PropTypes.string,
    title: PropTypes.string,
    showLinkCreationWindow: PropTypes.func,

    setData: PropTypes.func,
    data: PropTypes.object,
    readyToSubmit: PropTypes.bool,
    saving: PropTypes.bool,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
  }

  state = {
    showCreateVerb: false,
    duplicateTitle: null,
  }
  constructor (props) {
    super(props)
    const {
      parentId,
      title,
      focusedNode,
      setData,
    } = props

    let link = createEditableLink({
      isParent: true,
    })
    const parentFocused = parentId === focusedNode._id

    // Do not create a link to the parent when the parent is a cluster
    // since a tag will be created instead in componentDidMount
    if (parentId && (!parentFocused || !isCluster(focusedNode))) {
      link = createEditableLink({
        text: parentFocused ? focusedNode.name : 'Loading...',
        isParent: true,
        node: parentFocused ? focusedNode : null,
      })
    }

    setData({
      links: [link],
      title: title || '',
    }, false)
  }

  componentDidMount () {
    if (this.props.parentId) {
      getNode(this.props.parentId).then(node => {
        const parent = this.props.data.links[0]

        if (isCluster(node)) {
          const tag = clusterToPath[node._key || node._id]

          if (tag) {
            return this.props.setData({
              tags: [tag.slice(0)],
            }, false)
          }
        }

        this.props.setData({
          links: [
            {
              ...parent,
              text: node.title,
              node,
            },
            ...this.props.data.links.slice(1),
          ],
        }, false)
      })
    }
  }

  _addLink = () => {
    const { links } = this.props.data
    const link = createEditableLink()

    this.props.setData({
      links: [...links, link],
    })
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
  onRemoveLink = (linkIndex) => {
    const links = this.props.data.links

    this.props.setData({
      links: [
        ...links.slice(0, linkIndex),
        ...links.slice(linkIndex + 1),
      ],
    })
  }

  titleChanged = (value) => {
    this.props.setData({
      title: value,
    })
  }

  _handleDuplicateTitle = (node) => {
    this.setState({
      duplicateTitle: node,
    })
  }

  showLinkCreation = () => {
    const links = this.props.data.links
    const parentLink = links[0].node && links[0].isParent ? links[0] : null

    this.props.showLinkCreationWindow(parentLink)
  }

  _handleDuplicateDecision = (button) => {
    switch (button) {
      case 'Link': {
        const {
          links,
        } = this.props.data
        const parentIsCluster = links[0].node && isCluster(links[0].node)
        const newLinks = [
          ...links,
          createEditableLink({
            text: this.state.duplicateTitle.title,
            isParent: false,
            node: this.state.duplicateTitle.node,
            linkType: 'link',
          }),
        ]

        if (parentIsCluster) {
          newLinks.reverse()
        }
        this.props.showLinkCreationWindow(
          newLinks[0],
          newLinks[1]
        )
        break
      }
      case 'Cancel':
        this.setState({
          duplicateTitle: null,
        })
        break
      case 'Edit':
        this.props.showNodeEditWindow(this.state.duplicateTitle._key)
        break

     // no default
    }
  }

  showCreateVerb = (linkIndex) => {
    this.setState({
      showCreateVerb: true,
      addVerbFor: linkIndex,
    })
  }

  addVerb = (downText, upText) => {
    const addingVerb = downText && upText

    if (addingVerb) {
      const verbs = [
        ...this.props.data.verbs,
        [ downText, upText ],
      ]

      this.props.setData({
        verbs: [...verbs, [downText, upText]],
      })
      this.onLinkPropertyChanged(this.state.addVerbFor, 'verb', (verbs.length - 1) * 2)
    }

    this.setState({
      showCreateVerb: false,
    })
  }

  render () {
    const {
      title,
      tags,
      definition,
      links,
      picture,
      isCluster,
    } = this.props.data
    const {
      readyToSubmit,
      saving,
      setData,
      onCancel,
      onClose,
      onSave,
    } = this.props
    return (
      <div>
        <WindowWrapper zIndex={7}>
          <Overlay onClose={onClose} />
          <Window>
            <WindowHeader>
              Create a node
              <LinkCreationLink onClick={this.showLinkCreation}>
                <img src={linkIcon} alt='Create Link' />
                <span>Go to Link creation</span>
              </LinkCreationLink>
            </WindowHeader>
            <InputRow>
              <NodeInput
                id='node-title'
                value={title}
                onChange={this.titleChanged}
                placeholder='Topic Name'
                onNodeSelected={(node) => this._handleDuplicateTitle(node)}
              />
              <div>
                <TagSelector
                  advanced
                  tags={tags}
                  onChange={tags => this.props.setData({ tags: [...tags] })}
                />
              </div>
            </InputRow>
            <PathObjectForm
              picture={picture}
              definition={definition}
              onPictureChange={picture => setData({ picture })}
              onDefinitionChange={definition => setData({ definition })}
            />
            <Lineage
              title={title}
              links={links}
              onLinkTextChanged={(linkIndex, text) => this.onLinkPropertyChanged(linkIndex, 'text', text)}
              onLinkTargetChanged={(linkIndex, target) => this.onLinkPropertyChanged(linkIndex, 'node', target)}
              onLinkTypeChanged={(linkIndex, verbIndex) => this.onLinkPropertyChanged(linkIndex, 'type', verbIndex)}
              onLinkToggleIsParent={(linkIndex, isParent) => this.onLinkPropertyChanged(linkIndex, 'isParent', isParent)}
              onRemoveLink={this.onRemoveLink}
              addLink={this._addLink}
              showCreateVerb={this.showCreateVerb}
              multi
            />
            <Row>
              <Label htmlFor='is-cluster'>
                <input type='checkbox' id='is-cluster' checked={isCluster} onChange={() => setData({ isCluster: !isCluster })} />This node is a cluster
              </Label>
            </Row>

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
          {
            this.state.duplicateTitle &&
            <Dialog
              title='Node title already exists.'
              buttons={[ {
                text: 'Cancel',
                style: 'normal',
                negative: true,
              },
              ]}
              onClick={this._handleDuplicateDecision}
            >
              <HiddenLink onClick={() => this._handleDuplicateDecision('Link')}>Link {links[0].text} to {this.state.duplicateTitle.title}</HiddenLink>
              <HiddenLink onClick={() => this._handleDuplicateDecision('Edit')}>Edit {this.state.duplicateTitle.title}</HiddenLink>
            </Dialog>
          }
        </WindowWrapper>
        {
          this.state.showCreateVerb &&
          <CreateVerb onClose={this.addVerb} />
        }
      </div>
    )
  }
}

export default withFormWindowLogic(NodeCreationWindow, {
  defaultData: {
    title: '',
    definition: '',
    tags: [],
    nodeValue: '',
    selectedParent: null,
    selectedLinkVerbIndex: 0,
    picture: null,
    isCluster: false,
    links: [],
  },
  isClean (data) {
    return data.definition === '' &&
      data.title === '' &&
      data.tags.length === 0
  },
  readyForSubmit ({ title, definition, tags }) {
    return definition.length &&
      title.length // &&
      // tags.length
  },
  onSave: async (data, props) => {
    const { title, definition, links, isCluster } = cloneDeep(data)

    const parents = links.filter(link => link.isParent && link.node)
    const children = links.filter(link => !link.isParent && link.node)

    const unique = await checkTitleUnique(title)
    if (!unique) {
      const err = new Error('title-exists')
      err.reason = 'Node with title already exists'

      throw err
    }

    const result = await createNode({
      title,
      definition,
      _type: isCluster ? 'cluster' : 'topic',
    })

    const promises = parents.map(parent => {
      return createLink({
        parentKey: parent.node._id,
        childKey: result._id,
      })
    }).concat(children.map(child => {
      return createLink({
        parentKey: result._id,
        childKey: child.node._id,
      })
    }))

    await Promise.all(promises)
  },
  afterSave ({ links, tags }, props) {
    props.updateNodes(links.map(link => {
      return link.node._id
    }))
  },
  successMessage ({ title }) {
    return `You created a new topic: <strong>${title}!</strong>`
  },
  errorMessage (_data, _props, err) {
    return `Error creating node ${err.reason ? `: ${err.reason}` : ''}`
  },
})
