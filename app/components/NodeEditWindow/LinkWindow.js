import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  WindowWrapper,
  Window,
  WindowHeader,
} from 'elements/window'
import {
  Submit, FormActions, Cancel,
} from 'elements/form'
import Overlay from '../Overlay'
import LineageEditor from '../LineageEditor'
import {
  BlueText,
} from './elements'
import ConfirmDelete from './ConfirmDelete'
import AddLinkWindow from './AddLinkWindow'
import withFormWindowLogic from '../FormWindowLogic'
import promiseProgress from 'utils/promise-progress'
import { updateLinks, getLinkIds } from './saveChanges'
import { deleteLink } from 'api/link'
// import { clusterToPath } from 'utils/filter-tags'
import { cloneDeep } from 'lodash-es'

export class LinkWindow extends Component {
  static propTypes = {
    links: PropTypes.array,
    title: PropTypes.string,
    nodeKey: PropTypes.string,
    verbs: PropTypes.array,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    dirty: PropTypes.bool,
    showLinkPreview: PropTypes.func,
    onLinksDeleted: PropTypes.func,
    onAddedLink: PropTypes.func,
    setData: PropTypes.func,
    data: PropTypes.shape({
      links: PropTypes.array,
      originalLinks: PropTypes.array,
    }),
    setPopupMessage: PropTypes.func,
  }
  state = {
    showAddLinkWindow: false,
    linksToDelete: null,
  }

  componentDidMount = () => {
    this.props.setData({
      links: this.props.links,
      originalLinks: cloneDeep(this.props.links),
    })
  }

  changeLinkProperty = (index, property, value) => {
    const newLinks = [...this.props.data.links]
    newLinks[index][property] = value

    this.props.setData({
      links: newLinks,
    })
  }
  deleteLinks = async (links) => {
    this.setState({
      loadingProgress: 0,
    })
    const promises = links.map(link => {
      const {
        parent,
      } = getLinkIds(this.props.nodeKey, link)

      return deleteLink(parent, link.linkId)
    })

    await promiseProgress(promises, progress => this.setState({ loadingProgress: progress }))
    this.props.setPopupMessage({
      message: `Successfully deleted ${links.length} links`,
    })
    this.props.onLinksDeleted(links)

    const linkIds = links.map(link => link.linkId)
    this.props.setData({
      links: this.props.data.links.filter(link => {
        return !linkIds.includes(link.linkId)
      }),
      originalLinks: this.props.data.originalLinks.filter(link => {
        return !linkIds.includes(link.linkId)
      }),
    })
  }
  closeDeleteLinks = async (button) => {
    this.setState({
      linksToDelete: null,
    })

    if (button === 'YES') {
      const linksToDelete = this.state.linksToDelete
      this.props.setData({
        links: this.props.data.links.filter(link => {
          return linksToDelete.indexOf(link) === -1
        }),
        originalLinks: this.props.data.originalLinks.filter(link => {
          return linksToDelete.indexOf(link) === -1
        }),
      }, false)
      this.deleteLinks(linksToDelete)
    }
  }
  onAddedLink = (link) => {
    const links = [
      ...this.props.data.links,
      link,
    ]
    const originalLinks = [
      ...this.props.data.originalLinks,
      link,
    ]

    this.props.setData({
      links,
      originalLinks,
    }, false)
    this.props.onAddedLink(link)
  }

  render () {
    const {
      data: { links },
      title,
      verbs,
      onClose,
      onSave,
      onCancel,
      showLinkPreview,
      nodeKey,
      setPopupMessage,
    } = this.props

    if (!links) {
      return (
        <WindowWrapper zIndex={4}>
          <Overlay onClose={onClose} />
          <Window>
            Loading...{this.state.loadingProgress}%
          </Window>
        </WindowWrapper>
      )
    }

    return (
      <WindowWrapper zIndex={4}>
        <Overlay onClose={onClose} />
        <Window>
          <WindowHeader><BlueText>{links.length}</BlueText> Links in &laquo; {title} &raquo;</WindowHeader>
          <LineageEditor
            onLinkVerbChanged={(index, verb) => this.changeLinkProperty(index, 'verb', verb)}
            verbs={verbs}
            title={title}
            links={links}
            onDeleteLinks={links => this.setState({ linksToDelete: links })}
            showLinkPreview={showLinkPreview}
            nodeKey={nodeKey}
            showAddLinkWindow={() => this.setState({ showAddLinkWindow: true })}
          />
          <FormActions>
            <Cancel onClick={onCancel}>Cancel</Cancel>
            <Submit disabled={!this.props.dirty} onClick={onSave}>
              Submit
            </Submit>
          </FormActions>
        </Window>
        {this.state.linksToDelete && <ConfirmDelete
          onClose={this.closeDeleteLinks}
          links={this.state.linksToDelete}
          target='links'
          nodeTitle={title} />}
        {this.state.showAddLinkWindow && <AddLinkWindow
          title={title}
          verbs={verbs}
          onAddedLink={this.onAddedLink}
          onClose={() => this.setState({ showAddLinkWindow: false })}
          setPopupMessage={setPopupMessage}
          nodeKey={nodeKey}
        />}

      </WindowWrapper>
    )
  }
}

export default withFormWindowLogic(LinkWindow, {
  onSave (data, props) {
    updateLinks(props.nodeKey, data.originalLinks, data.links, props.verbs)
    props.updateLinks(data.links)
  },
})
