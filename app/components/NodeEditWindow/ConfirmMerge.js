import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Dialog from '../Dialog'

export default class ConfirmMerge extends Component {
  static propTypes = {
    targetTitle: PropTypes.string,
    mergeNodes: PropTypes.array,
    onClose: PropTypes.func,
  }
  listNodes = () => {
    const {
      mergeNodes,
    } = this.props

    return mergeNodes.filter(({ node }) => {
      return node && node.category
    }).map(({ node }, index) => {
      if (mergeNodes.length > 1 && index === mergeNodes.length - 1) {
        return `and ${node.category.t}`
      }

      return node.category.t
    }).join(mergeNodes.length === 2 ? ' ' : ', ')
  }
  render () {
    const {
      targetTitle,
      onClose,
    } = this.props
    const buttons = [
      {
        style: 'cta',
        text: 'CANCEL',
        negative: true,
      },
      {
        style: 'transparent',
        text: 'YES',
      },
    ]
    const nodeList = this.listNodes()

    return (
      <Dialog onClick={onClose} title='Merge node' buttons={buttons}>
        All links of {nodeList} will be added to {targetTitle}, and {nodeList} will be permanently deleted.
        <p>Do you wish to continue?</p>
      </Dialog>
    )
  }
}
