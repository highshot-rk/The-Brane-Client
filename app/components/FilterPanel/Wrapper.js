import { Container } from './elements'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  SidebarMenu,
} from 'components/SideBarMenu'

export default class Wrapper extends Component {
  static propTypes = {
    sidebarMenu: PropTypes.bool,
    condensed: PropTypes.bool,
    children: PropTypes.node,
  }
  render () {
    const {
      sidebarMenu,
      children,
      condensed,
    } = this.props

    if (sidebarMenu) {
      return (
        <SidebarMenu width='280px' autoHeight>
          {children}
        </SidebarMenu>
      )
    }

    return (
      <Container condensed={condensed}>
        {children}
      </Container>
    )
  }
}
