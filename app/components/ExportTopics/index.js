import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Drop } from './elements'
import AllOrbits from './icons/all_orbits.svg'
import CurrentOrbits from './icons/current_orbit.svg'
import Advanced from './icons/advanced.svg'

export default class ExportTopics extends Component {
  static propTypes = {
    open: PropTypes.func,
    exportTopics: PropTypes.func,
  }
  onClick = (name) => {
    this.props.open(name)
    if (name !== 'advanced') {
      this.props.exportTopics(name)
    }
  }
  render () {
    return (
      <Drop>
        <ul>
          <li>Export ...</li>
          <li onClick={() => this.onClick('all')}>
            Entire path
            <img src={AllOrbits} />
          </li>
          <li onClick={() => this.onClick('current')}>
            Current orbit
            <img src={CurrentOrbits} />
          </li>
          <li onClick={() => this.onClick('advanced')}>
            Advanced
            <img src={Advanced} />
          </li>
        </ul>
      </Drop>
    )
  }
}
