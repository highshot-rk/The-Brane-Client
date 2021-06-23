import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  VibrantWrapper,
  VibrantDrop,
  VibrantButton,
  VibrantToggle,
} from './elements'
import Overlay from '../Overlay'
import mergeIcon from './merge.svg'
import clusterIcon from './cluster.svg'
import trashIcon from './trash.svg'

export default class VibrantPopup extends Component {
  static propTypes = {
    showMergeNodeWindow: PropTypes.func,
    toggleCluster: PropTypes.func,
    isCluster: PropTypes.bool,
    deleteNode: PropTypes.func,
  }
  state = {
    expanded: false,
  }
  onClick = name => {
    this.setState({
      expanded: false,
    })

    switch (name) {
      case 'merge':
        return this.props.showMergeNodeWindow()
      case 'toggleCluster':
        return this.props.toggleCluster()
      case 'delete':
        return this.props.deleteNode()

      // no default
    }
  }
  render () {
    const toggle = <VibrantToggle onClick={() => this.setState({ expanded: true })}><span /><span /><span /></VibrantToggle>

    if (!this.state.expanded) {
      return toggle
    }

    return (
      <VibrantWrapper>
        {toggle}
        <Overlay transparent onClose={() => this.setState({ expanded: false })} />
        <VibrantDrop>
          <VibrantButton
            onClick={() => this.onClick('merge')}
            background='#8662DF'>
            <img src={mergeIcon} alt='Merge' />
            Merge Node
          </VibrantButton>
          <VibrantButton
            onClick={() => this.onClick('toggleCluster')}
            background='#83C686'>
            <img src={clusterIcon} alt='Set as a Cluster' />
            {this.props.isCluster ? 'Unset' : 'Set'} as a Cluster
          </VibrantButton>
          <VibrantButton
            onClick={() => this.onClick('delete')}>
            <img src={trashIcon} alt='Delete Node' />
            Delete Node
          </VibrantButton>
        </VibrantDrop>
      </VibrantWrapper>
    )
  }
}
