import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CheckedRowButton, AddRowButton } from 'elements/form'
import * as e from './elements'
import SortDirectionToggle from 'components/SortDirectionToggle'

export default class Property extends Component {
  static propTypes = {
    active: PropTypes.bool,
    title: PropTypes.string,
    color: PropTypes.string,
    sortDirection: PropTypes.string,
    isCluster: PropTypes.bool,
    onClick: PropTypes.func,
    onTitleClick: PropTypes.func,
    onToggleSortDirection: PropTypes.func,
    expanded: PropTypes.bool,
  }
  render () {
    const {
      active,
      title,
      color,
      onClick,
      onTitleClick,
      onToggleSortDirection,
      sortDirection,
      isCluster,
      expanded,
    } = this.props

    const background = expanded ? 'rgba(196, 196, 196, 0.5)' : ''
    const Wrapper = active ? CheckedRowButton : AddRowButton

    return (
      <Wrapper gray style={{ padding: '5px 16px', marginTop: 0, paddingLeft: isCluster ? '16px' : '36px', background }}>
        <button onClick={onClick} style={{ fontSize: '10px' }}>{active ? '✓' : '+'}</button>
        <e.PropertyTitle onClick={onTitleClick}>{title}</e.PropertyTitle>
        {!isCluster && active && <e.Color background={color} />}
        {!isCluster && active && <SortDirectionToggle onSelect={onToggleSortDirection} selected={sortDirection} />}
      </Wrapper>
    )
  }
}
