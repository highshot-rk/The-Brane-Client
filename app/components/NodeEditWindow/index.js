import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Window,
  WindowWrapper,
  WindowHeader,
} from 'elements/window'
import {
  InputRow,
  Submit,
  FormActions,
  Cancel,
  SectionTitle,
  AddRowButton,
} from 'elements/form'
import NodeInput from '../NodeInput'
import Overlay from '../Overlay'
import LinkWindow from './LinkWindow'
import AddLinkWindow from './AddLinkWindow'
import VibrantPopup from './VibrantPopup'
import MergeNodeWindow from './MergeNode'
import PathObjectForm from '../PathObjectForm'
import saveChanges, { diffLinks } from './saveChanges'
import ConfirmDelete from './ConfirmDelete'
import { cloneDeep } from 'lodash-es'
import withFormWindowLogic from '../FormWindowLogic'
import {
  getNode,
  deleteNode,
  getNodeImage,
  getRelatives,
} from 'api/node'
import { clusterKeyToTagPath, keyToTree } from 'utils/tags'
import { featureEnabled } from 'utils/features'
// import { isCluster } from 'utils/tags'
// import { clusterToPath } from 'utils/filter-tags'
import TagSelector from 'components/TagSelector'
import { createEditableLink } from 'utils/factories'

export class NodeEditWindow extends Component {
  static propTypes = {
    nodeId: PropTypes.string,
    showLinkPreview: PropTypes.func,
    setPopupMessage: PropTypes.func,
    onClose: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    updateNodes: PropTypes.func,

    // From HOC's
    setData: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    dirty: PropTypes.bool,
    saving: PropTypes.bool,
    progress: PropTypes.number,
    data: PropTypes.shape({
      node: PropTypes.object,
      links: PropTypes.array,
      verbs: PropTypes.array,
      originalData: PropTypes.object,
    }),
  }
  state = {
    showLinkWindow: false,
    showAddLinkWindow: false,
    showMergeNodeWindow: false,
    showDeleteNode: false,
    userType: 'super',
  }
  async componentDidMount () {
    const [ node, nodeImage ] = await Promise.all([
      getNode(`${this.props.nodeId}`),
      featureEnabled('uploadImages') && getNodeImage(this.props.nodeId),
    ])

    // const parsedData = this.parseNodeData(node)

    this.props.setData({
      node,
      links: [],
      picture: nodeImage ? {
        changed: false,
        preview: nodeImage.url,
      } : null,
      originalNode: cloneDeep(node),
    }, false)

    this.loadLinks()
  }
  loadLinks = async () => {
    const {
      nodeId,
    } = this.props

    const relatives = await getRelatives(nodeId, 'all')
    const editableLinks = relatives.map(relative => {
      return createEditableLink({
        text: relative.title,
        isParent: relative.linkDirection === 'parent',
        type: relative.linkType,
        node: relative,
        linkId: relative.linkId,
      })
    })

    this.props.setData({
      links: editableLinks,
      originalLinks: cloneDeep(editableLinks),
    })
  }
  createTags = links => {
    return links.map(link => {
      if (link.isTag && link.category._key !== this.props.nodeId) {
        return clusterKeyToTagPath(link.category._key)
      }

      return null
    }).filter(link => link !== null)
  }
  changeNodeProperty = (property, value) => {
    const node = {
      ...this.props.data.node,
    }
    node[property] = value
    this.props.setData({
      node,
    })
  }
  onAddedLink = (linkData) => {
    this.props.setData({
      links: [
        ...this.props.data.links,
        linkData,
      ],
      // Update original data so we don't create the link twice
      originalLinks: [
        ...this.props.data.originalLinks,
        linkData,
      ],
    })
    this.setState({
      showAddLinkWindow: false,
      showLinkWindow: true,
    })
  }
  closeDeleteNode = async (button) => {
    switch (button) {
      case 'CANCEL':
        this.setState({
          showDeleteNode: false,
        })
        break
      case 'YES':
        await deleteNode(this.props.data.node._id)
        this.props.updateNodes([
          this.props.data.node._id,
        ])
        this.props.onCancel()
        break

      // no default
    }
  }
  updateLinks = (links) => {
    this.props.setData({
      links,
    })
  }
  updateTags = tags => {
    const currentTags = this.createTags(this.props.data.links).map(tag => tag[tag.length - 1]._key)
    const modifiedTags = tags.map(tag => tag[tag.length - 1]._key)

    const addedTags = modifiedTags
      .filter(tag => !currentTags.includes(tag))
      .map(tagKey => keyToTree(tagKey))
      .map(tag => ({
        text: tag.title,
        isParent: true,
        isTag: true,
        parentKey: tag._key,
        verb: this.props.data.verbs.findIndex(verb => {
          return verb[0] === 'contains' && verb[1] === 'is a kind of'
        }) * 2,
        category: {
          _key: tag._key,
          t: tag.title,
          title: tag.title,
        },
      })
      )
    const removedTags = currentTags
      .filter(tagKey => !modifiedTags.includes(tagKey))

    this.props.setData({
      links: this.props.data.links.filter(link => {
        return !removedTags.includes(link.category._key)
      }).concat(
        ...addedTags
      ),
    })
  }
  onLinksDeleted = (links) => {
    const ids = links.map(link => link.linkId)

    this.props.setData({
      links: this.props.data.links.filter(link => {
        return !ids.includes(link.linkId)
      }),
    }, false)
  }
  render () {
    const {
      setPopupMessage,
      showLinkPreview,
      data,
      saving,
      progress,
      dirty,
      onCancel,
      onClose,
      onSave,
    } = this.props

    if (!data.node) {
      return <WindowWrapper zIndex={4}>
        <Overlay onClose={onClose} />
        <Window>
          Loading...
        </Window>
      </WindowWrapper>
    }
    return (
      <WindowWrapper zIndex={7}>
        <Overlay onClose={onClose} />
        {/* This can be removed once the api supports different types of users */}
        <div style={{
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 10,
          background: 'gray',
          display: featureEnabled('userTypes') ? 'block' : 'none',
        }}>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select value={this.state.userType} onChange={e => this.setState({ userType: e.target.value })}>
            <option value='basic'>Basic User</option>
            <option value='advance'>Advance User</option>
            <option value='super'>Super User</option>
          </select>
        </div>
        <Window>
          <WindowHeader>
            Edit Node &laquo; {data.node.title} &raquo;
            <VibrantPopup
              isCluster={data.node.isCluster}
              showMergeNodeWindow={() => this.setState({ showMergeNodeWindow: true })}
              toggleCluster={() => this.changeNodeProperty('isCluster', !data.node.isCluster)}
              deleteNode={() => this.setState({ showDeleteNode: true })}
            />
          </WindowHeader>
          <InputRow>
            <NodeInput
              id='node-title'
              value={data.node.title || ''}
              onChange={value => this.changeNodeProperty('title', value)}
              placeholder='Topic Name'
              onNodeSelected={() => {}}
              errorText={''}
            />
            {
              featureEnabled('filters') ? <TagSelector
                tags={this.createTags(data.links)}
                onChange={this.updateTags}
                error={''}
                advanced={this.state.userType === 'super'}
              /> : null}
          </InputRow>
          <PathObjectForm
            picture={data.picture}
            definition={data.node.definition}
            onPictureChange={picture => this.props.setData({ picture })}
            onDefinitionChange={definition => this.changeNodeProperty('definition', definition)}
          />
          <SectionTitle>
            Lineage
          </SectionTitle>
          <AddRowButton onClick={() => { this.setState({ showLinkWindow: true }) }}>
            {/* <img alt='Browse Links' src={linkIcon} /> */}
            <span>Browse current Linked topic ({data.links.length})</span>
          </AddRowButton>
          <AddRowButton onClick={() => { this.setState({ showAddLinkWindow: true }) }}>
            <button>+</button>
            <span>Add Link</span>
          </AddRowButton>
          <FormActions>
            <Cancel onClick={onCancel}>Cancel</Cancel>
            <Submit disabled={!dirty} onClick={onSave}>
              {saving ? `Saving... ${progress}%` : 'Submit'}
            </Submit>
          </FormActions>
        </Window>
        {this.state.showLinkWindow && <LinkWindow
          nodeKey={data.node._id}
          title={data.node.title}
          links={data.links}
          tagLinks={data.links.filter(link => link.isTag)}
          onClose={(closeAll) => closeAll ? onClose() : this.setState({ showLinkWindow: false })}
          onAddedLink={this.onAddedLink}
          updateLinks={this.updateLinks}
          onLinksDeleted={this.onLinksDeleted}
          showLinkPreview={showLinkPreview}
          setPopupMessage={setPopupMessage}
        />}
        {this.state.showAddLinkWindow && <AddLinkWindow
          title={data.node.title}
          nodeKey={data.node._id}
          verbs={data.verbs}
          onAddedLink={this.onAddedLink}
          onClose={() => this.setState({ showAddLinkWindow: false })}
          setPopupMessage={setPopupMessage} />}
        {this.state.showMergeNodeWindow &&
          <MergeNodeWindow
            onMergedNodes={onClose}
            title={data.node.title}
            links={data.links}
            nodeKey={data.node._id}
            onClose={(closeAll) => closeAll ? onClose() : this.setState({ showMergeNodeWindow: false }) && this.componentDidMount()}
            setPopupMessage={setPopupMessage} />
        }
        {this.state.showDeleteNode && <ConfirmDelete onClose={this.closeDeleteNode} links={data.links} target='node' nodeTitle={data.node.title} />}
      </WindowWrapper>
    )
  }
}

export default withFormWindowLogic(NodeEditWindow, {
  onSave (data) {
    return saveChanges(
      data.originalNode,
      data,
      data.verbs
    )
  },
  readyForSubmit ({ node: { title = '', definition = '' }, links }) {
    return title.length &&
      definition.length &&
      links.filter(link => link.isTag).length > 0
  },
  afterSave (data, props) {
    const addedLinks = diffLinks(data.originalLinks, data.links).added

    props.updateNodes([
      data.node._id,
      ...addedLinks.map(link => link.category._key),
    ])
  },
  successMessage (data) {
    return `Saved changes to ${data.node.title}`
  },
  errorMessage: 'Error while saving changes',
})
