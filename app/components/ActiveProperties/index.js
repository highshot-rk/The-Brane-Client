import * as e from './elements'

import Icon from 'components/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ActiveProperties extends Component {
  static propTypes = {
    activeProperties: PropTypes.array,
    open: PropTypes.func,
    clear: PropTypes.func,
    tagFilters: PropTypes.array,
  }

  clear = (e) => {
    // Prevent open click handler from being called
    e.stopPropagation()

    this.props.clear()
  }
  render () {
    const properties = this.props.activeProperties.map(property => property.title)

    return (
      <e.Container filtersActive={this.props.tagFilters.length} onClick={this.props.open}>
        <e.FilterList>{properties.join(', ')}</e.FilterList>
        <e.Label><Icon name='property' width={14} height={14} /> properties active</e.Label>
        <e.Close onClick={this.clear}>&times;</e.Close>
      </e.Container>
    )
  }
}
