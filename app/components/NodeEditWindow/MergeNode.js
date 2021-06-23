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
import Overlay from '../Overlay'
import { MergeWrapper, MergeTree, MergeDescription, Link } from './elements'
import NodeInput from '../NodeInput'
import linkIcon from './link.svg'
import { mergeNodes } from './saveChanges'
import MergeLinksWindow from './MergeLinksWindow'
import ConfirmMerge from './ConfirmMerge'
import withFormWindowLogic from '../FormWindowLogic'
import {
  getNode,
} from 'api/node'
import {
  getLink,
} from 'api/link'

export class MergeWindow extends Component {
  static propTypes = {
    title: PropTypes.string,
    nodeKey: PropTypes.string,
    links: PropTypes.array,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    data: PropTypes.shape({
      mergeNodes: PropTypes.object,
    }),
    setData: PropTypes.func,
    onCancel: PropTypes.func,
    saving: PropTypes.bool,
    progress: PropTypes.number,
    dirty: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    onMergedNodes: PropTypes.func,
  }
  state = {
    text: '',
    loading: false,
    showLinks: false,
    confirmMerge: false,
    showTargetLinks: false,
  }
  changeNodeProperty = (index, property, value) => {
    const mergeNodes = [...this.props.data.mergeNodes]
    mergeNodes[index] = {
      ...mergeNodes[index],
    }
    mergeNodes[index][property] = value

    if (property === 'node') {
      // Remove links for old node
      mergeNodes[index].links = null
      mergeNodes[index].text = value.category.t
    }

    this.props.setData({
      mergeNodes,
    })
  }
  loadLinks = async (nodeIndex) => {
    const mergeNode = this.props.data.mergeNodes[nodeIndex]
    const nodeKey = mergeNode.node.category._key
    const {
      data: node,
    } = await getNode(nodeKey)

    const promises = [
      ...node.parents.map(parent => {
        return getLink(parent._key, nodeKey)
      }),
      ...node.children.map(child => {
        return getLink(nodeKey, child._key || child._id)
      }),
    ]

    const links = await Promise.all(promises)

    this.changeNodeProperty(nodeIndex, 'links', links.map((link, index) => {
      const category = index < node.parents.length ? node.parents[index] : node.children[index - node.parents.length]
      return {
        category: {
          ...category,
          title: category.title || category.t,
        },
        verb: [
          // Sometimes the verb is null
          link.data.d || 'is related to',
          link.data.u || 'is related to',
        ],
        isParent: index < node.parents.length,
      }
    }))
  }
  loadAllLinks = async () => {
    this.setState({
      loading: true,
    })
    const linkPromises = this.props.data.mergeNodes.map(({ links }, index) => {
      if (links === null) {
        return this.loadLinks(index)
      }
    })

    await Promise.all(linkPromises)

    this.setState({
      loading: false,
    })
  }
  handleConfirmResult = (button) => {
    if (button === 'YES') {
      this.mergeNodes()
    }

    this.setState({
      confirmMerge: false,
    })
  }
  mergeNodes = async () => {
    await this.loadAllLinks()
    this.props.onSave()
  }
  showLinks = () => {
    this.setState({
      showLinks: true,
    })
    this.loadAllLinks()
  }
  render () {
    const {
      title,
      onClose,
      onCancel,
      nodeKey,
      data,
      links,
    } = this.props
    return (
      <WindowWrapper zIndex={4}>
        <Overlay onClose={onClose} />
        <Window>
          <WindowHeader>Merge Node &laquo; {title} &raquo; </WindowHeader>
          <MergeWrapper>
            <div className='nodes'>
              <div className='node'>{title} <img alt='View nodes links' onClick={() => this.setState({ showTargetLinks: true })} src={linkIcon} /></div>
              {
                data.mergeNodes.map((node, index) =>
                  <NodeInput
                    key={index}
                    id={`merge-source-${index}`}
                    excludedKeys={[nodeKey]}
                    value={node.text}
                    onChange={value => this.changeNodeProperty(index, 'text', value)}
                    placeholder='Node'
                    onNodeSelected={node => this.changeNodeProperty(index, 'node', node)}
                  />
                )
              }
            </div>
            <div className='merge-tree-container'>
              <MergeTree>
                <line strokeDasharray='2' x1='0%' y1={0} x2='50%' y2='128px' />
                <line strokeDasharray='2' x1='100%' y1={0} x2='50%' y2='128px' />
                {
                  data.mergeNodes.map((_node, index) =>
                    <line key={index} strokeDasharray='2' x1={`${(index + 1) / data.mergeNodes.length * 100}%`} y1={0} x2='50%' y2='128px' />
                  )
                }
                <line x1='50%' y1='128px' x2='50%' y2='203px' />
              </MergeTree>
            </div>
            <div className='target-node'>{title}</div>
          </MergeWrapper>
          <MergeDescription>
            This action will merge {title} with any selected nodes.<br />
            All <Link onClick={this.showLinks}>links</Link> of the selected nodes will be added to {title}. <br />
            All information related to {title} remains. <br />
            The selected nodes will be permanently deleted after the operation.
          </MergeDescription>
          <FormActions>
            <Cancel onClick={onCancel}>Cancel</Cancel>
            <Submit disabled={!this.props.dirty} onClick={() => this.setState({ confirmMerge: true })}>
              {this.state.loading ? 'Loading...'
                : this.props.saving ? `Saving... ${this.props.progress}%`
                  : 'Merge'}
            </Submit>
          </FormActions>
        </Window>
        {this.state.showTargetLinks &&
          <MergeLinksWindow
            nodes={[{ node: {
              category: {
                t: title,
              } },
            links,
            }]}
            onClose={() => this.setState({ showTargetLinks: false })}
          />}
        {this.state.showLinks && <MergeLinksWindow loading={this.state.loading} nodes={data.mergeNodes} onClose={() => this.setState({ showLinks: false })} />}
        {this.state.confirmMerge && <ConfirmMerge onClose={this.handleConfirmResult} targetTitle={title} mergeNodes={data.mergeNodes} />}
      </WindowWrapper>
    )
  }
}

export default withFormWindowLogic(MergeWindow, {
  defaultData: {
    mergeNodes: [{
      text: '',
      node: null,
      links: null,
    }] },
  onSave (data, props) {
    return mergeNodes({
      targetKey: props.nodeKey,
      targetLinks: props.links,
      nodes: data.mergeNodes,
    })
  },
  // TODO: include node titles in messages
  successMessage: 'Finished merging nodes',
  errorMessage: 'Error while merging nodes',
})
