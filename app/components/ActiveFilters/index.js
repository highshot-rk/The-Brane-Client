import * as e from './elements'

import Icon from 'components/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  allUniqueTags,
  clusterKeyToTagPath,
} from 'utils/tags'

export default class ActiveFilters extends Component {
  static propTypes = {
    tagFilters: PropTypes.array,
    open: PropTypes.func,
    clear: PropTypes.func,
    getCount: PropTypes.func,
  }

  clear = (e) => {
    // Prevent open click handler from being called
    e.stopPropagation()

    this.props.clear()
  }
  render () {
    const tags = allUniqueTags(this.props.tagFilters)
      .filter(tagFilter => this.props.getCount(clusterKeyToTagPath(tagFilter._key)) > 0)
      .map(tag => tag.title)
    return (
      <e.Container onClick={this.props.open}>
        <e.FilterList>{tags.join(', ')}</e.FilterList>
        <e.Label><Icon name='small-filter' width={10} height={10} /> filter active</e.Label>
        <e.Close onClick={this.clear}>&times;</e.Close>
      </e.Container>
    )
  }
}
