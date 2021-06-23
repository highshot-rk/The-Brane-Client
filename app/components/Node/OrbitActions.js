import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SingleNodeView, CreateButton, ClusterStateToggle } from './icons'
import { C02_DARK, C01_LIGHT } from '../../styles/colors'
import { featureEnabled } from 'utils/features'

export default class OrbitActions extends Component {
  static propTypes = {
    orbitRadius: PropTypes.number,
    menuOpen: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    isChildren: PropTypes.bool,
    showCreateButton: PropTypes.bool,
    isCluster: PropTypes.bool,
    toggleClusterState: PropTypes.func,
    createNode: PropTypes.func,
    showSingleNodeView: PropTypes.func,
  }

  render () {
    const {
      orbitRadius,
      menuOpen,
      showSingleNodeView,
      isChildren,
      showCreateButton,
      createNode,
      isCluster,
      toggleClusterState,
    } = this.props

    const showClusterState = featureEnabled('clusterState') && isCluster

    return (
      <>
        {isChildren &&
        <SingleNodeView
          orbitRadius={orbitRadius}
          color={menuOpen ? C02_DARK : C01_LIGHT}
          showSingleNodeView={showSingleNodeView} />}
        {showCreateButton && <CreateButton orbitRadius={orbitRadius} onClick={createNode} />}
        {showClusterState && <ClusterStateToggle orbitRadius={orbitRadius} onClick={toggleClusterState} />}
      </>
    )
  }
}
