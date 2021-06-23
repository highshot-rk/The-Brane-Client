import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Dialog from '../Dialog'
import LinkList from './LinkList'

export default class MergeLinksWindow extends Component {
  static propTypes = {
    nodes: PropTypes.array,
    onClose: PropTypes.func,
    loading: PropTypes.bool,
  }
  render () {
    const {
      nodes,
      onClose,
      loading,
    } = this.props
    const buttons = [
      {
        style: 'cta',
        text: 'OKAY',
      },
    ]

    return (
      <Dialog onClick={onClose} title='Links' buttons={buttons}>
        {loading ? 'Loading...' : nodes.map(node =>
          <LinkList nodeTitle={node.node.category.t} links={node.links} />
        )}
      </Dialog>
    )
  }
}
