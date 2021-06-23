import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SORT_ASCENDING, SORT_DESCENDING, SORT_DEFAULT } from 'utils/constants'
import Icon from 'components/Icon'

const ICON_NAMES = {
  [SORT_ASCENDING]: 'sort-ascending',
  [SORT_DESCENDING]: 'sort-descending',
  [SORT_DEFAULT]: 'sort-default',
}
const toggleOrder = [
  SORT_DESCENDING,
  SORT_ASCENDING,
  SORT_DEFAULT,
]

export default class SortDirectionToggle extends Component {
  static propTypes = {
    selected: PropTypes.string,
    onSelect: PropTypes.bool,
  }
  onClick = () => {
    let current = toggleOrder.indexOf(this.props.selected)
    if (current === -1) {
      current = 0
    }
    const next = (current + 1) % toggleOrder.length
    this.props.onSelect(toggleOrder[next])
  }
  render () {
    const {
      selected = toggleOrder[0],
    } = this.props
    const icon = ICON_NAMES[selected]

    return (
      <Icon onClick={this.onClick} name={icon} width='12' height='11' />
    )
  }
}
