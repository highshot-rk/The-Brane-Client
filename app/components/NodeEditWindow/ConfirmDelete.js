import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Dialog from '../Dialog'
import LinkList from './LinkList'

export default class ConfirmDelete extends Component {
  static propTypes = {
    links: PropTypes.array,
    nodeTitle: PropTypes.string,
    target: PropTypes.string,
    onClose: PropTypes.func,
  }
  render () {
    const {
      links,
      nodeTitle,
      target,
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
    const title = target === 'node'
      ? 'Delete Node'
      : 'Delete Links'
    const text = target === 'node'
      ? <p>This action will permanently delete <strong>{nodeTitle}</strong> with its {links.length} links.</p>
      : <p>This action will permanently delete {links.length} links:</p>

    return (
      <Dialog onClick={onClose} title={title} buttons={buttons}>
        {text}
        <LinkList nodeTitle={nodeTitle} links={links} />
        <p>Do you wish to continue?</p>
      </Dialog>
    )
  }
}
